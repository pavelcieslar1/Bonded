namespace Bonded.DTO
{
    public class QuestionAnswerPairDTO
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; }
        public string? AnswerA { get; set; }
        public string? AnswerB { get; set; }
    }

}
