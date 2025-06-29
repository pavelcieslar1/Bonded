using Bonded.DTO;
using Bonded.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System;
using System.Diagnostics;

namespace Bonded.Services
{
    public class MatchScoreResult
    {
        public string UserBId { get; set; }
        public double FinalScore { get; set; }
    }

    public class MatchService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserService _userService;

        public MatchService(ApplicationDbContext context, UserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<MatchDetailDTO> GetMatchDetailAsync(string userAId, string userBId)
        {
            var finalScore = await ComputeMatchScoreAsync(userAId, userBId);
            var sharedHobbies = await GetSharedHobbiesAsync(userAId, userBId);
            var conflictingHobbies = await GetConflictingHobbiesAsync(userAId, userBId);
            var strongCategories = await GetStrongCategoriesAsync(userBId);
            var weakCategories = await GetWeakCategoriesAsync(userBId);
            var questionnaireAnswers = await GetQuestionnaireAnswersAsync(userAId,userBId);

            UserProfileDTO? userA = await _userService.GetUserProfileByIdAsync(userAId);
            UserProfileDTO? userB = await _userService.GetUserProfileByIdAsync(userBId);

            MatchDetailDTO matchDetailDTO = new MatchDetailDTO
            {
                FinalScore = finalScore.FinalScore,
                AProfileDTO = userA,
                BProfileDTO = userB,
                SharedHobbies = sharedHobbies,
                ConflictingHobbies = conflictingHobbies,
                StrongCategories = strongCategories,
                WeakCategories = weakCategories,
                QuestionnaireAnswers = questionnaireAnswers,
                GeminiSummary = string.Empty
            };

            return matchDetailDTO;
        }

        public async Task<List<QuestionAnswerPairDTO>> GetQuestionnaireAnswersAsync(string userAId, string userBId)
        {
            // Načti odpovědi A
            var userA = await _context.Users
                .Include(u => u.UserProfile)
                .ThenInclude(up => up.Answers)
                .ThenInclude(a => a.Question)
                .ThenInclude(b => b.AnswerOptions)
                .FirstOrDefaultAsync(u => u.Id == userAId);

            // Načti odpovědi B
            var userB = await _context.Users
                .Include(u => u.UserProfile)
                .ThenInclude(up => up.Answers)
                .ThenInclude(a => a.Question)
                .ThenInclude(b => b.AnswerOptions)
                .FirstOrDefaultAsync(u => u.Id == userBId);

            if (userA?.UserProfile?.Answers == null || userB?.UserProfile?.Answers == null)
                return new List<QuestionAnswerPairDTO>();

            // Slož mapu odpovědí (pro rychlý přístup podle questionId)
            var answersA = userA.UserProfile.Answers.ToDictionary(
                a => a.Question.Id,
                a => a.AnswerId.HasValue ? a.Answer.Label : null 
            );
            var answersB = userB.UserProfile.Answers.ToDictionary(
                a => a.Question.Id,
                a => a.AnswerId.HasValue ? a.Answer.Label : null
            );

            // Vytvoř přehled všech unikátních otázek
            var allQuestions = userA.UserProfile.Answers
                .Select(a => a.Question)
                .Union(userB.UserProfile.Answers.Select(a => a.Question))
                .DistinctBy(q => q.Id)
                .ToList();

            var pairs = allQuestions.Select(q => new QuestionAnswerPairDTO
            {
                QuestionId = q.Id,
                QuestionText = q.Text,
                AnswerA = answersA.TryGetValue(q.Id, out var ansA) ? ansA : null,
                AnswerB = answersB.TryGetValue(q.Id, out var ansB) ? ansB : null
            }).ToList();

            return pairs;
        }

        public async Task<List<string>> GetWeakCategoriesAsync(string userId)
        {
            var user = await _context.Users
                .Include(u => u.UserProfile)
                .ThenInclude(up => up.Answers)
                .ThenInclude(ans => ans.Question)
                .ThenInclude(q => q.Category)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user?.UserProfile?.Answers == null)
                return new List<string>();

            var categoryScores = _userService.CalculateCategoryScores(user.UserProfile.Answers);

            // Vezmi jen ty kategorie, kde má uživatel pod 30 %
            var weakCategories = categoryScores
                .Where(s => s.Points.HasValue && s.MaxPoints.HasValue && s.MaxPoints.Value > 0)
                .Where(s => (s.Points.Value / (double)s.MaxPoints.Value) < 0.3)
                .Select(s => s.CategoryName)
                .ToList();

            return weakCategories;
        }

        public async Task<List<string>> GetStrongCategoriesAsync(string userId)
        {
            var user = await _context.Users
                .Include(u => u.UserProfile)
                .ThenInclude(up => up.Answers)
                .ThenInclude(ans => ans.Question)
                .ThenInclude(q => q.Category)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user?.UserProfile?.Answers == null)
                return new List<string>();

            var categoryScores = _userService.CalculateCategoryScores(user.UserProfile.Answers);

            // Vezmi jen ty kategorie, kde má uživatel nad 70 %
            var strongCategories = categoryScores
                .Where(s => s.Points.HasValue && s.MaxPoints.HasValue && s.MaxPoints.Value > 0)
                .Where(s => (s.Points.Value / (double)s.MaxPoints.Value) > 0.7)
                .Select(s => s.CategoryName)
                .ToList();

            return strongCategories;
        }


        //ZISKA KONFLIKTNI HOBBY
        public async Task<List<ConflictingHobbyDTO>> GetConflictingHobbiesAsync(string userAId, string userBId)
        {
            var conflictPairs = new List<(string, string)>
                {
                    ("Party", "Calm"),
                    ("Adrenaline", "Relaxing"),
                    ("Night", "Early"),
                    ("Introverted", "Extroverted"),
                    ("Noisy", "Quiet"),
                    ("Extreme", "Cautious"),
                    ("Digital", "Nature"),
                    ("Adventure", "Homebody"),
                    ("Competitive", "Cooperative")
                };

            var userA = await _context.Users
                .Include(u => u.UserProfile)
                .ThenInclude(up => up.UserHobbies)
                .ThenInclude(uh => uh.Hobby)
                .FirstOrDefaultAsync(u => u.Id == userAId);

            var userB = await _context.Users
                .Include(u => u.UserProfile)
                .ThenInclude(up => up.UserHobbies)
                .ThenInclude(uh => uh.Hobby)
                .FirstOrDefaultAsync(u => u.Id == userBId);

            if (userA?.UserProfile?.UserHobbies == null || userB?.UserProfile?.UserHobbies == null)
                return new List<ConflictingHobbyDTO>();

            var hobbiesA = userA.UserProfile.UserHobbies.Select(uh => uh.Hobby).ToList();
            var hobbiesB = userB.UserProfile.UserHobbies.Select(uh => uh.Hobby).ToList();

            var result = new List<ConflictingHobbyDTO>();

            foreach (var hobbyA in hobbiesA)
            {
                var tagsA = hobbyA.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(t => t.Trim());
                foreach (var hobbyB in hobbiesB)
                {
                    var tagsB = hobbyB.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(t => t.Trim());
                    foreach (var (tag1, tag2) in conflictPairs)
                    {
                        // Najdeme konflikt v libovolném směru (A má tag1, B má tag2) nebo (A má tag2, B má tag1)
                        if (tagsA.Contains(tag1, StringComparer.OrdinalIgnoreCase) && tagsB.Contains(tag2, StringComparer.OrdinalIgnoreCase))
                        {
                            result.Add(new ConflictingHobbyDTO { HobbyA = hobbyA.Name, HobbyB = hobbyB.Name, ConflictTagA = tag1, ConflictTagB = tag2 });
                        }
                        else if (tagsA.Contains(tag2, StringComparer.OrdinalIgnoreCase) && tagsB.Contains(tag1, StringComparer.OrdinalIgnoreCase))
                        {
                            result.Add(new ConflictingHobbyDTO { HobbyA = hobbyA.Name, HobbyB = hobbyB.Name, ConflictTagA = tag1, ConflictTagB = tag2 });
                        }
                    }
                }
            }

            return result;
        }


        //ZÍSKÁ STEJNÉ KONÍČKY
        public async Task<List<string>> GetSharedHobbiesAsync(string userAId, string userBId)
        {
            var userA = await _context.Users
                .Include(u => u.UserProfile)
                .ThenInclude(up => up.UserHobbies)
                .ThenInclude(uh => uh.Hobby)
                .FirstOrDefaultAsync(u => u.Id == userAId);

            var userB = await _context.Users
                .Include(u => u.UserProfile)
                .ThenInclude(up => up.UserHobbies)
                .ThenInclude(uh => uh.Hobby)
                .FirstOrDefaultAsync(u => u.Id == userBId);

            if (userA?.UserProfile?.UserHobbies == null || userB?.UserProfile?.UserHobbies == null)
                return new List<string>();

            var hobbiesA = userA.UserProfile.UserHobbies
                .Select(uh => uh.Hobby.Name)
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            var hobbiesB = userB.UserProfile.UserHobbies
                .Select(uh => uh.Hobby.Name)
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            // Průnik názvů hobby
            var shared = hobbiesA.Intersect(hobbiesB, StringComparer.OrdinalIgnoreCase).ToList();

            return shared;
        }


        public async Task<MatchScoreResult> ComputeMatchScoreAsync(string userAId, string userBId)
        {
            var profileA = await _context.Users.Include(u => u.UserProfile)
                                                    .ThenInclude(uh => uh.UserHobbies)
                                                    .ThenInclude(h => h.Hobby)
                                               .Include(u => u.UserProfile)
                                               .ThenInclude(up => up.Answers)
                                               .ThenInclude(a => a.Question)
                                               .ThenInclude(q => q.Category)
                                               .FirstOrDefaultAsync(u => u.Id == userAId);
            var profileB = await _context.Users.Include(u => u.UserProfile)
                                                    .ThenInclude(uh => uh.UserHobbies)
                                                    .ThenInclude(h => h.Hobby)
                                               .Include(u => u.UserProfile)
                                               .ThenInclude(up => up.Answers)
                                               .ThenInclude(a => a.Question)
                                               .ThenInclude(q => q.Category)
                                               .FirstOrDefaultAsync(u => u.Id == userBId);

            //Debug.WriteLine(profileA?.UserProfile?.FirstName + " vs " + profileB?.UserProfile?.FirstName);

            if (profileA == null || profileB == null)
            {
                return new MatchScoreResult();
            }

            if (profileA?.UserProfile?.Answers == null || profileB?.UserProfile?.Answers == null)
            {
                return new MatchScoreResult();
            }


            var scoresA = _userService.CalculateCategoryScores(profileA.UserProfile.Answers);
            var scoresB = _userService.CalculateCategoryScores(profileB.UserProfile.Answers);

            if (scoresA.Count == 0 || scoresB.Count == 0) return new MatchScoreResult();    
            if (scoresA.Count != scoresB.Count) return new MatchScoreResult();

            double totalSimilarity = 0;
            double modifierSum = 0;
            double weight = 0;

            foreach (var a in scoresA)
            {
                //Najdeme odpovídající kategorii ve skóre druhého uživatele (např. „Empatie“ se porovnává s „Empatie“).
                var b = scoresB.FirstOrDefault(x => x.CategoryName == a.CategoryName);
                if (b == null) continue;
                if (a.Points == null || a.MaxPoints == null || b.Points == null || b.MaxPoints == null) continue;

                //Vypočítáme poměr odpovědí ku maximálním bodům (např. 18 z 25 bodů = 0.72)
                double percentA = a.Points.Value / (double)a.MaxPoints.Value;
                double percentB = b.Points.Value / (double)b.MaxPoints.Value;

                //Čím menší rozdíl mezi uživateli, tím vyšší similarity
                //pomocí Math.Pow zvýrazníme větší rozdíly (např. rozdíl 0.4 se silněji penalizuje)
                double similarity = 1.0 - Math.Pow(Math.Abs(percentA - percentB), 1.5);

                //Doplňujeme jemný bonus nebo penalizaci na základě významu konkrétní kategorie
                double modifier = GetModifier(a.CategoryName, a.Points.Value, a.MaxPoints.Value, b.Points.Value, b.MaxPoints.Value);

                //Shromažďujeme průměrné skóre a počet kategorií, které jsme srovnávali.
                totalSimilarity += similarity;
                modifierSum += modifier;
                weight += 1;
            }

            // Průměrná podobnost se dále zeslabí škálováním:
            double baseScore = weight == 0 ? 0 : totalSimilarity / weight;
            baseScore = Math.Pow(baseScore, 2); // škálování — větší rozdíly se víc trestají //1.5

            var normalizedA = ToNormalizedDictionary(scoresA);
            var normalizedB = ToNormalizedDictionary(scoresB);

            //Identifikuje rizikové kombinace (např. slabá emoční stabilita vs. silné romantické očekávání).
            double riskPenalty = EvaluateRiskCombinations(normalizedA);

            //Odměňuje zvlášť důležité shody v klíčových kategoriích (např. emoční stabilita, řešení konfliktů).
            double coreBonus = EvaluateCoreMatchBonus(normalizedA, normalizedB);

            //Přidává body za společné koníčky
            double hobbyBonus = CalculateHobbyBonus(profileA.UserProfile.UserHobbies.Select(h => h.Hobby.Name).ToList(), profileB.UserProfile.UserHobbies.Select(h => h.Hobby.Name).ToList());

            //Odebírá body za koníčky, které se mohou vzájemně vylučovat (např. "Pařba" vs. "Meditace").
            double hobbyPenalty = EvaluateHobbyConflicts(profileA.UserProfile.UserHobbies.Select(h => h.Hobby).ToList(), profileB.UserProfile.UserHobbies.Select(h => h.Hobby).ToList());

            //Přidává drobné bonusy za shodu v údajích z profilu (kouření, alkohol, víra, děti, atd.)
            double staticBonus = EvaluateStaticProfileBonus(profileA.UserProfile, profileB.UserProfile);

            //Naopak penalizuje za zásadní rozdíly (např. jeden chce vztah, druhý flirt).
            double staticPenalty = EvaluateStaticProfilePenalty(profileA.UserProfile, profileB.UserProfile);

            //Sčítáme bonusy a penalizace odděleně 
            double totalBonus = coreBonus + staticBonus + hobbyBonus;
            double totalPenalty = Math.Abs(staticPenalty) + Math.Abs(riskPenalty) + Math.Abs(hobbyPenalty); // vše záporné

            //baseScore je hlavní metrika podobnosti osobnosti
            //Bonusy a penalizace upravují výsledek, ale mají menší váhu (50 %)
            //Penalizace jsou přísnější (100 % vliv)
            //Clamp zajišťuje, že výsledek bude mezi 0.0 a 1.0
            double finalScore = Math.Clamp((baseScore) + (totalBonus * 0.7) - (totalPenalty * 1.0), 0.0, 1.0);



            return new MatchScoreResult { UserBId = userBId, FinalScore = Math.Round(finalScore * 100, 2) };
        }

        /// <summary>
        /// Vypočítá bonus za shodu v klíčových kategoriích, které jsou důležité pro vztah.
        /// </summary>
        private double GetModifier(string category, int pointsA, int maxA, int pointsB, int maxB)
        {
            if (maxA == 0 || maxB == 0)
                return 0.0;

            double percentA = pointsA / (double)maxA;
            double percentB = pointsB / (double)maxB;
            double diff = Math.Abs(percentA - percentB); // 0.0 až 1.0

            switch (category)
            {
                case "Empatie":
                    return CalculateModifier(diff, 0.03, 0.02, -0.02, -0.03);

                case "Emoční stabilita":
                    return CalculateModifier(diff, 0.03, 0.02, -0.02, -0.03);

                case "Řešení konfliktů":
                    return CalculateModifier(diff, 0.03, 0.02, -0.03, -0.04);

                case "Komunikace":
                    return CalculateModifier(diff, 0.03, 0.02, -0.02, -0.03);

                case "Trpělivost":
                    return CalculateModifier(diff, 0.02, 0.01, -0.02, -0.03);

                case "Otevřenost a flexibilita":
                    return CalculateModifier(diff, 0.02, 0.01, -0.01, -0.02);

                case "Romantická očekávání":
                    return CalculateModifier(diff, 0.01, 0.01, -0.01, -0.02);

                case "Smysl pro humor":
                    return CalculateModifier(diff, 0.01, 0.01, -0.01, -0.02);

                case "Hodnoty a přesvědčení":
                    return CalculateModifier(diff, 0.03, 0.02, -0.02, -0.03);

                case "Životní styl a hodnoty":
                    return CalculateModifier(diff, 0.02, 0.02, -0.02, -0.03);

                case "Vztah k rodině":
                    return CalculateModifier(diff, 0.02, 0.01, -0.02, -0.03);

                case "Zodpovědnost a spolehlivost":
                    return CalculateModifier(diff, 0.02, 0.02, -0.02, -0.03);

                case "Kariéra a ambice":
                    return CalculateModifier(diff, 0.01, 0.01, -0.01, -0.02);

                default:
                    return CalculateModifier(diff, 0.01, 0.005, -0.005, -0.02);
            }
        }

        private double CalculateModifier(double diff, double bonusLow, double bonusMid, double penaltyMid, double penaltyHigh)
        {
            return diff switch
            {
                <= 0.04 => bonusLow,
                <= 0.10 => bonusMid,
                <= 0.20 => penaltyMid,
                _ => penaltyHigh
            };
        }

        /// <summary>
        /// Vyhodnotí rizikové kombinace kategorií a vrátí penalizaci (čím vyšší riziko, tím vyšší záporná hodnota).
        /// </summary>
        public static double EvaluateRiskCombinations(Dictionary<string, double> scores)
        {
            double penalty = 0.0;

            // Nízká empatie + nízká komunikace
            if (scores.TryGetValue("Empatie", out var empatie) && empatie < 0.4 &&
                scores.TryGetValue("Komunikace", out var komunikace) && komunikace < 0.4)
            {
                penalty -= 0.05;
            }

            // Nízká trpělivost + nízká emoční stabilita
            if (scores.TryGetValue("Trpělivost", out var trpelivost) && trpelivost < 0.4 &&
                scores.TryGetValue("Emoční stabilita", out var stabilita) && stabilita < 0.4)
            {
                penalty -= 0.05;
            }

            // Rozpor v hodnotách + vysoká zodpovědnost
            if (scores.TryGetValue("Hodnoty a přesvědčení", out var hodnoty) &&
                scores.TryGetValue("Zodpovědnost a spolehlivost", out var zodpovednost) &&
                Math.Abs(hodnoty - zodpovednost) > 0.5)
            {
                penalty -= 0.04;
            }

            // Vysoká kariéra + nízký vztah k rodině
            if (scores.TryGetValue("Kariéra a Ambice", out var kariera) && kariera > 0.7 &&
                scores.TryGetValue("Vztah k rodině", out var rodina) && rodina < 0.3)
            {
                penalty -= 0.03;
            }

            // Velký rozdíl ve smyslu pro humor + nízká otevřenost
            if (scores.TryGetValue("Smysl pro humor", out var humor) &&
                scores.TryGetValue("Otevřenost a flexibilita", out var otevrenost) &&
                Math.Abs(humor - otevrenost) > 0.5 && otevrenost < 0.4)
            {
                penalty -= 0.03;
            }

            // Rozpor v romantických očekáváních a komunikaci
            if (scores.TryGetValue("Romantická očekávání", out var romantika) &&
                scores.TryGetValue("Komunikace", out var komunikace2) &&
                Math.Abs(romantika - komunikace2) > 0.6)
            {
                penalty -= 0.02;
            }

            // Extrémní rozdíl ve stylu života vs. trpělivost
            if (scores.TryGetValue("Životní styl a hodnoty", out var styl) &&
                scores.TryGetValue("Trpělivost", out var trpelivost2) &&
                Math.Abs(styl - trpelivost2) > 0.6)
            {
                penalty -= 0.03;
            }

            return penalty;
        }

        /// <summary>
        /// Pomocná metoda pro převedení List<CategoryScoreDTO> na Dictionary<string, double> se skóre 0.0–1.0
        /// </summary>
        public static Dictionary<string, double> ToNormalizedDictionary(List<CategoryScoreDTO> scores)
        {
            return scores
                .Where(s => s.CategoryName != null && s.Points.HasValue && s.MaxPoints.HasValue && s.MaxPoints.Value > 0)
                .ToDictionary(
                    s => s.CategoryName!,
                    s => s.Points!.Value / (double)s.MaxPoints!.Value
                );
        }

        /// <summary>
        /// Bonus za shodu v extrémně důležitých kategoriích (např. Hodnoty, Řešení konfliktů)
        /// </summary>
        public static double EvaluateCoreMatchBonus(Dictionary<string, double> scoresA, Dictionary<string, double> scoresB)
        {
            string[] coreCategories = new[] { "Hodnoty a přesvědčení", "Řešení konfliktů", "Emoční stabilita" };
            double bonus = 0.0;

            foreach (var category in coreCategories)
            {
                if (scoresA.TryGetValue(category, out var a) && scoresB.TryGetValue(category, out var b))
                {
                    double diff = Math.Abs(a - b);
                    if (diff < 0.15)
                        bonus += 0.03; // velmi podobní v klíčové oblasti
                }
            }

            return bonus;
        }

        /// <summary>
        /// Vyhodnotí bonus na základě shody v zálibách. Čím víc společných, tím větší bonus (max 0.07).
        /// </summary>
        public static double CalculateHobbyBonus(List<string> hobbiesA, List<string> hobbiesB)
        {
            if (hobbiesA == null || hobbiesB == null || hobbiesA.Count == 0 || hobbiesB.Count == 0)
                return 0;

            var shared = hobbiesA.Intersect(hobbiesB, StringComparer.OrdinalIgnoreCase).Count();
            var union = hobbiesA.Union(hobbiesB, StringComparer.OrdinalIgnoreCase).Count();

            double similarity = (double)shared / union; // poměr společných zájmů
            return Math.Min(similarity * 0.07, 0.035); // bonus max 0.07
        }

        /// <summary>
        /// Vyhodnotí bonus za shodu ve statických profilech jako kuřák, alkohol, vyznání atd.
        /// </summary>
        public static double EvaluateStaticProfileBonus(UserProfile a, UserProfile b)
        {
            double bonus = 0.0;

            if (a.Smoker == b.Smoker) bonus += 0.01;
            if (a.Alcohol == b.Alcohol) bonus += 0.005;
            if (a.Religion == b.Religion) bonus += 0.015;
            if (a.RelationshitpStatus == b.RelationshitpStatus) bonus += 0.005;
            if (a.Etnicity == b.Etnicity) bonus += 0.005;
            if (a.LookingFor == b.LookingFor) bonus += 0.015;
            if (a.Chronotype == b.Chronotype) bonus += 0.005;
            if (a.Life == b.Life) bonus += 0.005;
            if (a.Kids == b.Kids) bonus += 0.01;
            if (a.PersonalSpace == b.PersonalSpace) bonus += 0.005;

            return bonus;
        }

        /// <summary>
        /// Penalizace za silný nesoulad v zásadních profilech (např. děti, chronotyp, styl života)
        /// </summary>
        public static double EvaluateStaticProfilePenalty(UserProfile a, UserProfile b)
        {
            double penalty = 0.0;

            if (a.LookingFor != null && b.LookingFor != null &&
                a.LookingFor != b.LookingFor &&
                (a.LookingFor == "Povyražení" && b.LookingFor == "Vážný vztah" ||
                 b.LookingFor == "Povyražení" && a.LookingFor == "Vážný vztah"))
            {
                penalty -= 0.1;
            }

            if (a.Kids != null && b.Kids != null &&
                a.Kids != b.Kids &&
                (a.Kids.Contains("nechci") || b.Kids.Contains("nechci")))
            {
                penalty -= 0.08;
            }

            if (a.Chronotype != null && b.Chronotype != null &&
                a.Chronotype != b.Chronotype &&
                (a.Chronotype == "Ranní typ" && b.Chronotype == "Noční typ" ||
                 b.Chronotype == "Ranní typ" && a.Chronotype == "Noční typ"))
            {
                penalty -= 0.015;
            }

            if (a.Life != null && b.Life != null &&
                a.Life != b.Life &&
                (a.Life.Contains("Dobrodružný") && b.Life.Contains("Klidný") ||
                 b.Life.Contains("Dobrodružný") && a.Life.Contains("Klidný")))
            {
                penalty -= 0.08;
            }

            if (a.PersonalSpace != null && b.PersonalSpace != null &&
                a.PersonalSpace != b.PersonalSpace &&
                (a.PersonalSpace.Contains("hodně") && b.PersonalSpace.Contains("společně") ||
                 b.PersonalSpace.Contains("hodně") && a.PersonalSpace.Contains("společně")))
            {
                penalty -= 0.1;
            }

            
            if (Math.Abs(a.DateOfBirth.Value.Year - b.DateOfBirth.Value.Year) > 15)
                penalty -= 0.1;


            return penalty;
        }

        /// <summary>
        /// Penalizace za konfliktní zájmy mezi dvěma uživateli.
        /// </summary>
        public static double EvaluateHobbyConflicts(List<Hobby> hobbiesA, List<Hobby> hobbiesB)
        {
            // Předem definované konfliktní dvojice tagů
            var conflictPairs = new List<(string, string)>
        {
            ("Party", "Calm"),
            ("Adrenaline", "Relaxing"),
            ("Night", "Early"),
            ("Introverted", "Extroverted"),
            ("Noisy", "Quiet"),
            ("Extreme", "Cautious"),
            ("Digital", "Nature"),
            ("Adventure", "Homebody"),
            ("Competitive", "Cooperative")
        };

            var tagsA = hobbiesA.SelectMany(h => h.Tags.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(t => t.Trim())).ToHashSet(StringComparer.OrdinalIgnoreCase);
            var tagsB = hobbiesB.SelectMany(h => h.Tags.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(t => t.Trim())).ToHashSet(StringComparer.OrdinalIgnoreCase);

            int conflicts = 0;

            foreach (var (tag1, tag2) in conflictPairs)
            {
                if ((tagsA.Contains(tag1) && tagsB.Contains(tag2)) ||
                    (tagsA.Contains(tag2) && tagsB.Contains(tag1)))
                {
                    conflicts++;
                }
            }

            return -Math.Min(conflicts * 0.01, 0.05);
        }

        /// <summary>
        /// Penalizace za silný nesoulad v zásadních profilech (např. děti, chronotyp, styl života)
        /// </summary>
        public static bool IsOrientationCompatible(UserProfile a, UserProfile b)
        {
            // Bisexuál muž nesmí dostat heterosexuálního muže
            if (a.Orientation == "Bisexual" && a.Gender == "Muž" && b.Orientation == "Heterosexual" && b.Gender == "Muž")
                return false;

            // heterosexuálního muž nesmí dostat bisexualniho muže
            if (a.Orientation == "Heterosexual" && a.Gender == "Muž" && b.Orientation == "Bisexual" && b.Gender == "Muž")
                return false;

            // Bisexuál žena nesmí dostat heterosexuální ženu
            if (a.Orientation == "Bisexual" && a.Gender == "Žena" && b.Orientation == "Heterosexual" && b.Gender == "Žena")
                return false;

            // heterosexuální žena nesmí dostat bisexualni ženu
            if (a.Orientation == "Heterosexual" && a.Gender == "Žena" && b.Orientation == "Bisexual" && b.Gender == "Žena")
                return false;

            // Hetero × Hetero = pouze opačné pohlaví
            if (a.Orientation == "Heterosexual" && b.Orientation == "Heterosexual" && a.Gender == "Muž" && b.Gender == "Žena")
                return true;

            if (a.Orientation == "Heterosexual" && b.Orientation == "Heterosexual" && a.Gender == "Žena" && b.Gender == "Muž")
                return true;

            // Hetero × Homo = nikdy
            if ((a.Orientation == "Heterosexual" && b.Orientation == "Homosexual") ||
                (a.Orientation == "Homosexual" && b.Orientation == "Heterosexual"))
                return false;

            // Homo × Homo = pouze stejné pohlaví
            if (a.Orientation == "Homosexual" && b.Orientation == "Homosexual" && a.Gender == b.Gender)
                return true;

            if (a.Orientation == "Homosexual" && b.Orientation == "Homosexual" && a.Gender == "Jiné" && b.Gender == "Muž")
                return true;

            if (a.Orientation == "Homosexual" && b.Orientation == "Homosexual" && a.Gender == "Muž" && b.Gender == "Jiné")
                return true;

            if (a.Orientation == "Homosexual" && b.Orientation == "Homosexual" && a.Gender == "Jiné" && b.Gender == "Žena")
                return true;

            if (a.Orientation == "Homosexual" && b.Orientation == "Homosexual" && a.Gender == "Žena" && b.Gender == "Jiné")
                return true;

            // Pokud jeden je bi, druhý cokoliv, tak OK
            if (a.Orientation == "Bisexual" && b.Orientation == "Jine")
                return true;

            // Pokud jeden je bi, druhý cokoliv, tak OK
            if (a.Orientation == "Bisexual")
                return true;

            return false;
        }

        /// <summary>
        /// Hard filter pro kompatibilitu, který zohledňuje děti.
        /// </summary>
        public bool IsLookingForCompatible(UserProfile a, UserProfile b)
        {
            if (a.Kids.Contains("Chci") && b.Kids.Contains("Nechci")) return false;
            if (a.Kids.Contains("Nechci") && b.Kids.Contains("Chci")) return false;
            if (a.Kids.Contains("Nechci") && b.Kids.Contains("Ano")) return false;

            return true;
        }
    }

}
