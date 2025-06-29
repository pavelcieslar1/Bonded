namespace Bonded.Models
{
    public class QuestionnaireCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }                                    // Název kategorie (např. "Empatie")
        public string? Description { get; set; }                            // Popis (pro tooltip/info)
        public ICollection<QuestionnaireQuestion> Questions { get; set; }
    }
}
