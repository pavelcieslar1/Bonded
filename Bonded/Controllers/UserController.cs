using Bonded.DTO;
using Bonded.Models;
using Bonded.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Reflection;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Bonded.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly UserService _userService;
        private readonly ApplicationDbContext _context;
        public UserController(UserManager<AppUser> userManager, ApplicationDbContext context, UserService userService)
        {
            _userManager = userManager;
            _context = context;
            _userService = userService;
        }

        //VRACÍ "NÁŠ" UŽIVATELSKÝ PROFIL PODLE EMAILU
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyProfile()
        {
            var email = User.Identity?.Name;
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var profile = await _userService.GetUserProfileByEmailAsync(email);
            if (profile == null) return Unauthorized();

            return Ok(profile);
        }

        //VRACÍ "CIZÍ" UŽIVATELSKÝ PROFIL PODLE ID
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetPublicProfile(string id)
        {
            var profile = await _userService.GetUserProfileByIdAsync(id);
            if (profile == null) return NotFound();

            return Ok(profile);
        }


        //AKTUALIZUJE UŽIVATELSKÝ PROFIL
        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UserProfileDTO dto)
        {
            var email = User.Identity?.Name;
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var success = await _userService.UpdateUserProfileAsync(dto, email);
            return success ? Ok() : Unauthorized();
        }


        //AKTUALIZUJE UŽIVATELSKÝ DOTAZNÍK
        [HttpPut("answers")]
        [Authorize]
        public async Task<IActionResult> UpdateUserQuestion([FromBody] UserProfileDTO dto)
        {
            var email = User.Identity?.Name;
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var success = await _userService.UpdateUserAnswersAsync(dto, email);
            return success ? Ok() : Unauthorized();
        }

        //ULOŽENÍ PROFILOVÉ FOTKY
        [HttpPost("profile-photo")]
        [Authorize]
        public async Task<IActionResult> SaveProfilePhoto([FromBody] SavePhotoDTO dto)
        {
            var email = User.Identity?.Name;
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var success = await _userService.SaveProfilePhotoAsync(email, dto.ImageUrl);
            return success ? Ok() : Unauthorized();
        }


        //VRACÍ NÁHODNÉ UŽIVATELE ZE STEJNÉHO MĚSTA
        [HttpGet("random-users")]
        [Authorize]
        public async Task<IActionResult> GetRandomUsersFromSameCity()
        {
            var email = User.Identity?.Name;
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var users = await _userService.GetRandomUsersFromSameCityAsync(email);
            return Ok(users);
        }

        //VRACÍ UŽIVATELE PODLE FILTRU
        [HttpGet("filter")]
        [Authorize]
        public async Task<IActionResult> FilterUsers([FromQuery] string? city, [FromQuery] string? state, [FromQuery] List<int>? hobbyIds, [FromQuery] string? currentUserId)
        {
            var users = await _userService.FilterUsersAsync(city, state, hobbyIds, currentUserId);
            return Ok(users);
        }

        [HttpGet("list")]
        [Authorize]
        public async Task<IActionResult> GetUsers([FromQuery] string? name, [FromQuery] string? email, [FromQuery] string? id)
        {
            var users = await _userService.GetUsersAsync(name, email, id);
            return Ok(users);
        }

        //SMAZÁNÍ UŽIVATELE (pouze pro adminy)
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if (string.IsNullOrEmpty(id)) return BadRequest("ID uživatele je povinné");

            var success = await _userService.DeleteUserAsync(id);
            return success ? Ok() : NotFound("Uživatel nebyl nalezen");
        }

    }
}
