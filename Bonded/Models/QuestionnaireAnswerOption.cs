namespace Bonded.Models
{
    public class QuestionnaireAnswerOption
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public QuestionnaireQuestion Question { get; set; }

        public string Label { get; set; }   // Text odpovědi (např. "a) Pomohl/a bych mu")
        public int Score { get; set; }      // Bodové ohodnocení pro párování
        public int DisplayOrder { get; set; }     // Pořadí (a, b, c...)
    }
}
