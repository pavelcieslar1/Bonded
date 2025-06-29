using Bonded.Models;

namespace Bonded.DTO
{
    public class UserProfileDTO
    {
        public string? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public int? Height { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string? Orientation { get; set; }
        public string? Etnicity { get; set; }
        public string? Religion { get; set; }
        public string? Education { get; set; }
        public string? RelationshitpStatus { get; set; }
        public string? AstralSign { get; set; }
        public string? Smoker { get; set; }
        public string? Alcohol { get; set; }
        public string? Bio { get; set; }
        public string? LookingFor { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string? Chronotype { get; set; }
        public string? Life { get; set; }
        public string? Kids { get; set; }
        public string? PersonalSpace { get; set; }

        // Odpovědi na test osobnosti – skóre v každé kategorii
        public ICollection<UserQuestionnaireAnswerDTO>? Answers { get; set; }

        // Zájmy a koníčky
        public ICollection<int>? HobbyIds { get; set; }
        public ICollection<int>? OccupationIds { get; set; }

        public ICollection<string>? HobbyNames { get; set; }
        public ICollection<string>? OccupationNames { get; set; }
        public ICollection<CategoryScoreDTO>? CategoryScores { get; set; }
    }
}
