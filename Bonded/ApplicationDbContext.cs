using Bonded.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Bonded
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        { }
        public DbSet<Hobby> Hobbies { get; set; }
        public DbSet<Occupation> Occupations { get; set; }
        public DbSet<QuestionnaireCategory> QuestionnaireCategories { get; set; }
        public DbSet<QuestionnaireQuestion> QuestionnaireQuestions { get; set; }
        public DbSet<QuestionnaireAnswerOption> QuestionnaireAnswers { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<UserQuestionnaireAnswers> UserQuestions { get; set; }
        public DbSet<UserHobby> UserHobbies { get; set; }
        public DbSet<UserOccupation> UserOccupations { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ChatUser> ChatUsers { get; set; }

    }
}
