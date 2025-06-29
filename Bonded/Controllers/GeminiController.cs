using Bonded.DTO;
using Bonded.Services;
using Bonded.Services.External;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bonded.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GeminiController : ControllerBase
    {
        private readonly GeminiClient _gemini;
        private readonly GeminiService _geminiService;
        private readonly UserService _userService;


        public GeminiController(GeminiClient gemini,GeminiService geminiService, UserService userService)
        {
            _gemini = gemini;
            _geminiService = geminiService;
            _userService = userService;
        }

        [HttpPost("analyze-match")]
        [Authorize]
        public async Task<IActionResult> AnalyzeMatch([FromBody] string prompt)
        {
            if (string.IsNullOrWhiteSpace(prompt)) return BadRequest("Prompt is required.");

            var result = await _gemini.GenerateSummaryAsync(prompt);
            return Ok(new { summary = result });
        }

        [HttpPost("get-horoscope")]
        [Authorize]
        public async Task<IActionResult> GetHoroscope([FromBody] string sign)
        {
            if (string.IsNullOrWhiteSpace(sign)) return BadRequest("Sign is required.");
            var result = await _geminiService.GetHoroscopeAsync(sign);
            return Ok(result);
        }

        public class GetHintMessageRequest
        {
            public string PartnerId { get; set; }
            public string ChatContent { get; set; }
        }


        [HttpPost("get-hint-message")]
        [Authorize(Roles = "Admin, Premium")]
        public async Task<IActionResult> GetMessageHint([FromBody] GetHintMessageRequest messageRequest)
        {
            if (string.IsNullOrWhiteSpace(messageRequest.PartnerId)) return BadRequest("Partner is required.");

            UserProfileDTO partnerProfileDTO = await _userService.GetUserProfileByIdAsync(messageRequest.PartnerId);

            var result = await _geminiService.GetMessageHintAsync(partnerProfileDTO, messageRequest.ChatContent);
            return Ok(result);
        }

    }
}
