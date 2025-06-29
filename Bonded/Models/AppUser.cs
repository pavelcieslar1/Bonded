using Microsoft.AspNetCore.Identity;

namespace Bonded.Models
{
    public class AppUser : IdentityUser
    {   
        public int UserProfileId { get; set; }
        public UserProfile? UserProfile { get; set; }
    }
}
