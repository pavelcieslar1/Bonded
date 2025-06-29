namespace Bonded.Models
{
    public class ChatUser
    {
        public int Id { get; set; }
        public int ChatId { get; set; }
        public Chat Chat { get; set; }

        public string UserId { get; set; }
        public AppUser User { get; set; }
    }

}
