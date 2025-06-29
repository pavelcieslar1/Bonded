namespace Bonded.Models
{
    public class Chat
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<ChatUser> ChatUsers { get; set; }
        public ICollection<Message> Messages { get; set; }
    }

}
