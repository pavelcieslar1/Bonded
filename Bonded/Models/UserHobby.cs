using System.ComponentModel.DataAnnotations.Schema;

namespace Bonded.Models
{
    [Table("UserHobby")]
    public class UserHobby
    {
        public int Id { get; set; }
        public int HobbyId { get; set; }
        public Hobby Hobby { get; set; }
        public int UserProfileId { get; set; }
        public UserProfile UserProfile { get; set; }
    }
}
