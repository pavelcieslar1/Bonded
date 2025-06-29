using Bonded.DTO;
using Bonded.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Bonded.Services
{
    public class UserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }


        //VOLÁNÍ UŽIVATELSKÉHO PROFILU PODLE EMAILU
        public Task<UserProfileDTO?> GetUserProfileByEmailAsync(string email) =>
            GetUserProfileInternalAsync(u => u.Email == email);

        //VOLÁNÍ UŽIVATELSKÉHO PROFILU PODLE ID
        public Task<UserProfileDTO?> GetUserProfileByIdAsync(string id) =>
            GetUserProfileInternalAsync(u => u.Id == id);

        //VRACÍ UŽIVATELSKÝ PROFIL PODLE ZADANÉHO VÝRAZU
        private async Task<UserProfileDTO?> GetUserProfileInternalAsync(Expression<Func<AppUser, bool>> predicate)
        {
            var user = await _context.Users
                .Include(u => u.UserProfile)
                    .ThenInclude(up => up.UserHobbies).ThenInclude(h => h.Hobby)
                .Include(u => u.UserProfile)
                    .ThenInclude(up => up.UserOccupations).ThenInclude(o => o.Occupation)
                .Include(u => u.UserProfile)
                    .ThenInclude(up => up.Answers)
                    .ThenInclude(a => a.Question)
                    .ThenInclude(q => q.Category)
                .FirstOrDefaultAsync(predicate);

            if (user?.UserProfile == null) return null;

            var profile = user.UserProfile;
            var scores = CalculateCategoryScores(profile.Answers);

            return new UserProfileDTO
            {
                Id = user.Id,
                FirstName = profile.FirstName,
                LastName = profile.LastName,
                DateOfBirth = profile.DateOfBirth,
                Gender = profile.Gender,
                Height = profile.Height,
                State = profile.State,
                City = profile.City,
                Orientation = profile.Orientation,
                Etnicity = profile.Etnicity,
                Religion = profile.Religion,
                Education = profile.Education,
                RelationshitpStatus = profile.RelationshitpStatus,
                AstralSign = profile.AstralSign,
                Smoker = profile.Smoker,
                Alcohol = profile.Alcohol,
                Bio = profile.Bio,
                LookingFor = profile.LookingFor,
                Chronotype = profile.Chronotype,
                Life = profile.Life,
                Kids = profile.Kids,
                PersonalSpace = profile.PersonalSpace,
                HobbyIds = profile.UserHobbies.Select(h => h.Hobby.Id).ToList(),
                HobbyNames = profile.UserHobbies.Select(h => h.Hobby.Name).ToList(),
                OccupationIds = profile.UserOccupations.Select(o => o.Occupation.Id).ToList(),
                OccupationNames = profile.UserOccupations.Select(o => o.Occupation.Name).ToList(),
                ProfileImageUrl = profile.ProfileImageUrl,
                CategoryScores = scores
            };
        }

        //AKTUALIZACE UŽIVATELSKÉHO PROFILU PODLE EMAILU
        public async Task<bool> UpdateUserProfileAsync(UserProfileDTO dto, string email)
        {
            var user = await _context.Users
                .Include(u => u.UserProfile)
                    .ThenInclude(up => up.UserHobbies)
                .Include(u => u.UserProfile)
                    .ThenInclude(up => up.UserOccupations)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user?.UserProfile == null) return false;

            var profile = user.UserProfile;
            profile.FirstName = dto.FirstName;
            profile.LastName = dto.LastName;
            profile.DateOfBirth = dto.DateOfBirth;
            profile.Gender = dto.Gender;
            profile.Height = dto.Height;
            profile.State = dto.State;
            profile.City = dto.City;
            profile.Orientation = dto.Orientation;
            profile.Etnicity = dto.Etnicity;
            profile.Religion = dto.Religion;
            profile.Education = dto.Education;
            profile.RelationshitpStatus = dto.RelationshitpStatus;
            profile.AstralSign = dto.AstralSign;
            profile.Smoker = dto.Smoker;
            profile.Alcohol = dto.Alcohol;
            profile.Bio = dto.Bio;
            profile.LookingFor = dto.LookingFor;
            profile.Chronotype = dto.Chronotype;
            profile.Life = dto.Life;
            profile.Kids = dto.Kids;
            profile.PersonalSpace = dto.PersonalSpace;

            if (dto.HobbyIds != null)
            {
                profile.UserHobbies.Clear();
                foreach (var hobbyId in dto.HobbyIds)
                {
                    profile.UserHobbies.Add(new UserHobby { HobbyId = hobbyId, UserProfileId = profile.Id });
                }
            }

            if (dto.OccupationIds != null)
            {
                profile.UserOccupations.Clear();
                foreach (var occId in dto.OccupationIds)
                {
                    profile.UserOccupations.Add(new UserOccupation { OccupationId = occId, UserProfileId = profile.Id });
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        //AKTUALIZACE ODPOVĚDÍ UŽIVATELE NA OTÁZKY
        public async Task<bool> UpdateUserAnswersAsync(UserProfileDTO dto, string email)
        {
            var user = await _context.Users
                .Include(u => u.UserProfile)
                    .ThenInclude(up => up.Answers)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user?.UserProfile == null) return false;

            var profile = user.UserProfile;

            if (dto.Answers != null)
            {
                profile.Answers.Clear();
                foreach (var ansDto in dto.Answers)
                {
                    profile.Answers.Add(new UserQuestionnaireAnswers
                    {
                        UserProfileId = profile.Id,
                        QuestionId = ansDto.QuestionId,
                        AnswerId = ansDto.AnswerId,
                        AnswerValue = ansDto.AnswerValue
                    });
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        // ULOŽENÍ PROFILOVÉ FOTKY UŽIVATELE
        public async Task<bool> SaveProfilePhotoAsync(string email, string imageUrl)
        {
            var user = await _context.Users
                .Include(u => u.UserProfile)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user?.UserProfile == null) return false;

            user.UserProfile.ProfileImageUrl = imageUrl;
            await _context.SaveChangesAsync();
            return true;
        }

        // ZÍSKÁNÍ NÁHODNÝCH UŽIVATELŮ Z TÉHOŽ MĚSTA JAKO UŽIVATEL PODLE EMAILU
        public async Task<List<object>> GetRandomUsersFromSameCityAsync(string email)
        {
            var currentUser = await _context.Users
                .Include(u => u.UserProfile)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (currentUser?.UserProfile?.City == null) return new List<object>();

            var city = currentUser.UserProfile.City;

            var usersRaw = await _context.Users
                .Include(u => u.UserProfile)
                .Where(u => u.UserProfile.City == city && u.Id != currentUser.Id)
                .OrderBy(u => Guid.NewGuid())
                .Take(100)
                .ToListAsync();

            var compatibleUsers = usersRaw
                .Where(u => MatchService.IsOrientationCompatible(currentUser.UserProfile, u.UserProfile))
                .Take(10)
                .ToList();



            return compatibleUsers.Select(u => new
            {
                u.Id,
                u.UserProfile.FirstName,
                u.UserProfile.LastName,
                Age = u.UserProfile.DateOfBirth.HasValue ? CalculateAge(u.UserProfile.DateOfBirth.Value) : (int?)null,
                u.UserProfile.City,
                u.UserProfile.ProfileImageUrl
            }).Cast<object>().ToList();
        }

        // VYPOČÍTÁ SKÓRE V KATEGORIÍCH Z ODPOVĚDÍ UŽIVATELE
        public List<CategoryScoreDTO> CalculateCategoryScores(ICollection<UserQuestionnaireAnswers> answers)
        {
            return answers
                .Where(a => a.AnswerValue != null && a.Question?.Category != null)
                .GroupBy(a => a.Question.Category)
                .Select(g => new CategoryScoreDTO
                {
                    CategoryId = g.Key.Id,
                    CategoryName = g.Key.Name,
                    Points = g.Sum(a => a.AnswerValue ?? 0),
                    MaxPoints = g.Count() * 5
                })
                .ToList();
        }

        // VYPOČÍTÁVÁ VĚK UŽIVATELE NA ZÁKLADĚ DATA NAROZENÍ
        public static int CalculateAge(DateTime birthDate)
        {
            if (birthDate == null) return 0;

            var today = DateTime.Today;
            var age = today.Year - birthDate.Year;

            if (birthDate.Date > today.AddYears(-age)) age--; // pokud ještě letos neslavil narozeniny

            return age;
        }

        //VYFILTRUJE UŽIVATELE NA ZAKLADĚ MĚSTA STATU A KONIČKU
        public async Task<List<UserProfileDTO>> FilterUsersAsync(string? city, string? state, List<int>? hobbies, string? currentUserId)
        {
            var query = _context.Users
                .Include(u => u.UserProfile)
                    .ThenInclude(p => p.UserHobbies)
                        .ThenInclude(uh => uh.Hobby)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(city))
                query = query.Where(u => u.UserProfile.City == city);

            if (!string.IsNullOrWhiteSpace(state))
                query = query.Where(u => u.UserProfile.State == state);

            if (hobbies != null && hobbies.Any())
                query = query.Where(u =>
                    hobbies.All(hobbyId => u.UserProfile.UserHobbies.Any(uh => uh.Hobby.Id == hobbyId)));

            // Vyloučíme vlastní profil
            query = query.Where(u => u.Id != currentUserId);

            // Vracíme jen profily, co mají aspoň 1 hobby
            query = query.Where(u => u.UserProfile.UserHobbies.Any());

            var users = await query
                .Select(u => new UserProfileDTO
                {
                    Id = u.Id,
                    FirstName = u.UserProfile.FirstName,
                    LastName = u.UserProfile.LastName,
                    City = u.UserProfile.City,
                    State = u.UserProfile.State,
                    HobbyNames = u.UserProfile.UserHobbies.Select(uh => uh.Hobby.Name).ToList(),
                    ProfileImageUrl = u.UserProfile.ProfileImageUrl
                })
                .ToListAsync();

            return users;
        }

        public async Task<List<UserAdminDTO>> GetUsersAsync(string? name, string? email, string? id)
        {
            var query = _context.Users
                .Include(u => u.UserProfile)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(id))
                query = query.Where(u => u.Id == id);

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(u =>
                    (u.UserProfile.FirstName + " " + u.UserProfile.LastName).Contains(name));

            if (!string.IsNullOrWhiteSpace(email))
                query = query.Where(u => u.Email.Contains(email));

            var users = await query
                .Select(u => new UserAdminDTO
                {
                    Id = u.Id,
                    FirstName = u.UserProfile.FirstName,
                    LastName = u.UserProfile.LastName,
                    Email = u.Email,
                    Role = (from ur in _context.UserRoles
                            join r in _context.Roles on ur.RoleId equals r.Id
                            where ur.UserId == u.Id
                            select r.Name).FirstOrDefault() ?? "Standard"
                })
                .ToListAsync();

            return users;
        }

        //SMAZÁNÍ UŽIVATELE
        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _context.Users
                .Include(u => u.UserProfile)
                    .ThenInclude(up => up.UserHobbies)
                .Include(u => u.UserProfile)
                    .ThenInclude(up => up.UserOccupations)
                .Include(u => u.UserProfile)
                    .ThenInclude(up => up.Answers)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return false;

            // Smazání souvisejících dat
            if (user.UserProfile != null)
            {
                // Smazání odpovědí na dotazník
                _context.UserQuestions.RemoveRange(user.UserProfile.Answers);
                
                // Smazání uživatelských koníčků
                _context.UserHobbies.RemoveRange(user.UserProfile.UserHobbies);
                
                // Smazání uživatelských povolání
                _context.UserOccupations.RemoveRange(user.UserProfile.UserOccupations);
                
                // Smazání uživatelského profilu
                _context.UserProfiles.Remove(user.UserProfile);
            }

            // Smazání uživatele
            _context.Users.Remove(user);

            await _context.SaveChangesAsync();
            return true;
        }

    }
}
