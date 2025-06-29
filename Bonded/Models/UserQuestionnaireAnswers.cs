namespace Bonded.Models
{
    public class UserQuestionnaireAnswers
    {
        public int Id { get; set; }

        // Uživatelská vazba
        public int UserProfileId { get; set; }
        public UserProfile User { get; set; }

        // Odkaz na otázku a kategorii
        public int QuestionId { get; set; }
        public QuestionnaireQuestion Question { get; set; }

        // Zvolená odpověď (1–5)
        public int? AnswerId { get; set; }
        public int? AnswerValue { get; set; }
        public QuestionnaireAnswerOption? Answer { get; set; }

    }
}
