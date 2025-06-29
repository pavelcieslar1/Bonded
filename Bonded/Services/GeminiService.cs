using Bonded.DTO;
using Bonded.Models;
using Bonded.Services.External;
using System.Diagnostics;

namespace Bonded.Services
{
    public class GeminiService
    {
        private readonly GeminiClient _gemini;

        public GeminiService(GeminiClient gemini)
        {
            _gemini = gemini;
        }

        public async Task<string> AnalyzeMatchAsync(
        UserProfileDTO userA,
        UserProfileDTO userB,
        MatchDetailDTO matchDetail)
        {
            // Pomocné funkce pro formátování
            string FormatList(IEnumerable<string> items, string oddelovac = ", ") =>
                (items != null && items.Any()) ? string.Join(oddelovac, items) : "žádné";

            string FormatConflicts(IEnumerable<ConflictingHobbyDTO> list)
            {
                if (list == null || !list.Any()) return "žádné";
                return string.Join("; ", list.Select(c => $"{c.HobbyA} ({c.ConflictTagA}) × {c.HobbyB} ({c.ConflictTagB})"));
            }

            string FormatCategories(IEnumerable<string> cats)
                => (cats != null && cats.Any()) ? string.Join(", ", cats) : "žádné";

            string FormatAnswers(IEnumerable<QuestionAnswerPairDTO> answers)
            {
                if (answers == null || !answers.Any()) return "";
                var lines = answers.Select(a =>
                    $"Otázka: {a.QuestionText}\n- Vy: {a.AnswerA ?? "nezodpovězeno"}\n- Partner: {a.AnswerB ?? "nezodpovězeno"}");
                return string.Join("\n", lines);
            }

            // Hlavní prompt:
            var prompt = $@"
                Analyzuj potenciální vztah mezi dvěma osobami na základě následujících dat. Odpověz česky. Zaměř se na vztahový potenciál, životní kompatibilitu, silné i slabé stránky páru a možná rizika či výhody.

                **Vy**:
                Jméno: {userA.FirstName}
                Věk: {(userA.DateOfBirth.HasValue ? UserService.CalculateAge(userA.DateOfBirth.Value) : "neuveden")}
                Město: {userA.City}
                Status: {userA.RelationshitpStatus}
                Vztah hledám: {userA.LookingFor}
                Děti: {userA.Kids}
                Osobní prostor: {userA.PersonalSpace}
                Životní rytmus: {userA.Life}
                Chronotyp: {userA.Chronotype}
                Hobby: {FormatList(userA.HobbyNames)}

                **Partner**:
                Jméno: {userB.FirstName}
                Věk: {(userB.DateOfBirth.HasValue ? UserService.CalculateAge(userB.DateOfBirth.Value) : "neuveden")}
                Status: {userB.RelationshitpStatus}
                Město: {userB.City}
                Vztah hledá: {userB.LookingFor}
                Děti: {userB.Kids}
                Osobní prostor: {userB.PersonalSpace}
                Životní rytmus: {userB.Life}
                Chronotyp: {userB.Chronotype}
                Hobby: {FormatList(userB.HobbyNames)}

                **Celkové procento shody**: {matchDetail.FinalScore?.ToString("0.0") ?? "?"} %

                **Společné koníčky**: {FormatList(matchDetail.SharedHobbies)}
                **Rozdílné koníčky**: {FormatConflicts(matchDetail.ConflictingHobbies)}

                **Silné stránky vašeho partnera**: {FormatCategories(matchDetail.StrongCategories)}
                **Slabé stránky vašeho partnera**: {FormatCategories(matchDetail.WeakCategories)}

                **Srovnání odpovědí na osobnostní otázky**:
                {FormatAnswers(matchDetail.QuestionnaireAnswers)}

                Napiš srozumitelný a stručný rozbor (maximálně 1000 znaků), co z těchto dat vyplývá o vztahovém potenciálu této dvojice, kde mají největší šanci na harmonii a kde by naopak mohly vznikat problémy. Pokud možno, doporuč, na co se v budování vztahu zaměřit a čeho si dát pozor.
                Vem v potaz, že chceme vztah této dvoji vyzvihnout a né poškodit, ale také jim musíme říct pravdu, ale né moc negativně.
                ";


            return await _gemini.GenerateSummaryAsync(prompt);
        }

        public async Task<string> GetHoroscopeAsync(string sign)
        {
            var prompt = $@"
                Vytvoř horoskop pro znamení {sign} na denešní den. 
                Zaměř se na lásku, kariéru a zdraví. 
                Odpověz v češtině a udržuj délku do 500 znaků.";
            return await _gemini.GenerateSummaryAsync(prompt);
        }

        public async Task<string> GetMessageHintAsync(UserProfileDTO partnerProfileDTO, string chatContent)
        {
            string FormatList(IEnumerable<string> items, string oddelovac = ", ") =>
                (items != null && items.Any()) ? string.Join(oddelovac, items) : "žádné";

            string prompt = $@"
                Jsem na seznamce a chatuji s uživatelem jménem {partnerProfileDTO.FirstName}, který má zájmy jako: {FormatList(partnerProfileDTO.HobbyNames)}.

                Tady je několik posledních zpráv mezi námi: {chatContent}
                Pokud je chat úplně prázdný navrhni vhodnou úvodní zprávu, kterou mohu druhému uživateli napsat.

                Prosím navrhni jednu vhodnou zprávu, kterou bych mohl/a poslat jako další – ideálně takovou, která by navázala na předchozí konverzaci a podpořila přirozené pokračování dialogu. Může být i lehce hravá, osobní nebo na něco zajímavého navazujícího.

                Neodpovídej za mě. Napiš jen mou další zprávu v přímé řeči (v 1. osobě). Maximálně 200 znaků.
                ";


            return await _gemini.GenerateSummaryAsync(prompt);
        }
    }
}
