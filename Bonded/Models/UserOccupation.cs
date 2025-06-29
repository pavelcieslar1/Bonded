using System.ComponentModel.DataAnnotations.Schema;

namespace Bonded.Models
{
    [Table("UserOccupation")]
    public class UserOccupation
    {
        public int Id { get; set; }
        public int OccupationId { get; set; }
        public Occupation Occupation { get; set; }

        public int UserProfileId { get; set; }
        public UserProfile UserProfile { get; set; }

    }
}
