using Bonded.DTO;
using Bonded.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace Bonded.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MatchController : ControllerBase
    {
        private readonly MatchService _matchService;
        private readonly ApplicationDbContext _context;
        private readonly GeminiService _geminiService;

        public MatchController(MatchService matchService, ApplicationDbContext context, GeminiService geminiService)
        {
            _matchService = matchService;
            _context = context;
            _geminiService = geminiService;
        }

        [HttpGet("matches")]
        [Authorize]
        public async Task<IActionResult> GetMatchScore([FromQuery] string userAId, [FromQuery] string userBId)
        {
            MatchScoreResult score = await _matchService.ComputeMatchScoreAsync(userAId, userBId);
            if (score == null)
            {
                return NotFound("Match score not found.");
            }

            return Ok(score.FinalScore);
        }

        //To-Do
        //Neimplementovaná metoda pro získání shody mezi dvěma uživateli ze tejného města.
        [HttpGet("local-matches")]
        [Authorize]
        public async Task<IActionResult> GetLocalMatches([FromQuery] string userId)
        {
            var currentUser = await _context.Users.Include(u => u.UserProfile)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (currentUser == null || currentUser.UserProfile == null)
                return NotFound("User not found.");

            var usersInSameCity = await _context.Users
                .Include(u => u.UserProfile)
                .Where(u => u.Id != userId && u.UserProfile.City == currentUser.UserProfile.City)
                .ToListAsync();

            var matchResults = new List<MatchScoreResult>();

            foreach (var otherUser in usersInSameCity)
            {
                var result = await _matchService.ComputeMatchScoreAsync(userId, otherUser.Id);
                matchResults.Add(result);
            }
/*
            var topMatches = matchResults
                .OrderByDescending(m => m.FinalScore)
                .Take(3)
                .Select(m => new { UserId = m.UserId, Score = Math.Round(m.FinalScore * 100, 2) })
                .ToList();*/

            return Ok(null); //Dodělat, nejlepší shodu ze stejného města.
        }

        [HttpGet("global-matches")]
        [Authorize]
        public async Task<IActionResult> GetGlobalMatches([FromQuery] string userId)
        {
            var currentUser = await _context.Users
           .Include(u => u.UserProfile)
           .ThenInclude(p => p.UserHobbies)
           .ThenInclude(h => h.Hobby)
           .Include(u => u.UserProfile)
           .ThenInclude(p => p.Answers)
           .FirstOrDefaultAsync(u => u.Id == userId);

            if (currentUser == null)
                return NotFound("User not found.");

            // Kontrola, zda má uživatel vyplněný dotazník osobnosti
            if (currentUser.UserProfile?.Answers == null || !currentUser.UserProfile.Answers.Any())
            {
                return BadRequest("Pro použití globálního vyhledávání shod musíte mít vyplněný dotazník osobnosti.");
            }

            var userRelationshipPreference = currentUser.UserProfile.RelationshitpStatus;
            var userLookingForPreference = currentUser.UserProfile.LookingFor;

            var allOtherUsers = await _context.Users
            .Include(u => u.UserProfile)
            .ThenInclude(p => p.UserHobbies)
            .ThenInclude(h => h.Hobby)
            .Include(u => u.UserProfile)
            .ThenInclude(p => p.Answers)
            .Where(u => u.Id != userId && 
                   u.UserProfile.RelationshitpStatus == userRelationshipPreference && 
                   u.UserProfile.LookingFor == userLookingForPreference &&
                   u.UserProfile.Answers.Any()) // Kontrola, zda má i druhý uživatel vyplněný dotazník
            .ToListAsync();

            var matchScoreResults = new List<MatchScoreResult>();

            foreach (var otherUser in allOtherUsers)
            {
                if (!MatchService.IsOrientationCompatible(currentUser.UserProfile, otherUser.UserProfile)) continue;
                if (!_matchService.IsLookingForCompatible(currentUser.UserProfile, otherUser.UserProfile)) continue;

                MatchScoreResult result = await _matchService.ComputeMatchScoreAsync(userId, otherUser.Id);
                matchScoreResults.Add(result);
            }

            var topMatches = matchScoreResults
                .Where(m => m != null)
                .OrderByDescending(m => m.FinalScore)
                .Take(2)
                .Select(m => m);

            var matchResults = new List<MatchDetailDTO>();

            foreach (var topUsers in topMatches)
            {
                MatchDetailDTO result = await _matchService.GetMatchDetailAsync(userId, topUsers.UserBId);
                matchResults.Add(result);
            }

            foreach(var match in matchResults)
            {
               match.GeminiSummary = await _geminiService.AnalyzeMatchAsync(match.AProfileDTO, match.BProfileDTO, match);
            }

            return Ok(matchResults);
        }

        [HttpGet("premium-match")]
        [Authorize (Roles = "Admin, Premium")]
        public async Task<IActionResult> GetPremiumMatch([FromQuery] string userAId, string userBId)
        {
            var currentUser = await _context.Users.FindAsync(userAId);
            var partnerUser = await _context.Users.FindAsync(userBId);
            if (currentUser == null || partnerUser == null)
                return NotFound("User not found.");
            
            var matchScoreResults = await _matchService.ComputeMatchScoreAsync(userAId, userBId);
            if(matchScoreResults == null)
            {
                return NotFound("User questionner not found.");
            }

            var matchResults = new List<MatchDetailDTO>();
            MatchDetailDTO result = await _matchService.GetMatchDetailAsync(userAId, userBId);
            matchResults.Add(result);

            foreach (var match in matchResults)
            {
              match.GeminiSummary = await _geminiService.AnalyzeMatchAsync(match.AProfileDTO, match.BProfileDTO, match);
            }
            return Ok(matchResults);
        }
    }

}
