namespace Bonded.DTO
{
    public class MatchDetailDTO
    {
        public double? FinalScore { get; set; }
        public UserProfileDTO? AProfileDTO { get; set; }
        public UserProfileDTO? BProfileDTO { get; set; }
        public List<string>? SharedHobbies { get; set; }
        public List<ConflictingHobbyDTO>? ConflictingHobbies { get; set; }
        public List<string>? StrongCategories { get; set; }
        public List<string>? WeakCategories { get; set; }
        public List<QuestionAnswerPairDTO>? QuestionnaireAnswers { get; set; }
        public string? GeminiSummary { get; set; }
    }

    public class ConflictingHobbyDTO
    {
        public string HobbyA { get; set; }
        public string HobbyB { get; set; }
        public string ConflictTagA { get; set; }
        public string ConflictTagB { get; set; }
    }
}
