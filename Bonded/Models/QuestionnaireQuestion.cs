namespace Bonded.Models
{
    public class QuestionnaireQuestion
    {
        public int Id { get; set; }
        public string Text { get; set; }      // Text otázky

        public int CategoryId { get; set; }
        public QuestionnaireCategory Category { get; set; }

        // Pokud budeš mít více typů odpovědí, můžeš přidat např. QuestionType (enum)
        public int DisplayOrder { get; set; }
        public ICollection<QuestionnaireAnswerOption> AnswerOptions { get; set; }
    }
}
