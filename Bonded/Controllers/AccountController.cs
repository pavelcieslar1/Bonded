using Bonded.DTO;
using Bonded.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bonded.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ApplicationDbContext _context;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDTO model)
        {
            //Vytváříme prázdný profil, protože v databázi je UserProfile povinný.
            var profile = new UserProfile{};

            _context.UserProfiles.Add(profile);
            await _context.SaveChangesAsync();

            var user = new AppUser
            {
                Email = model.Email,
                UserName = model.Email,
                UserProfileId = profile.Id
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok();
            }

            return BadRequest(result.Errors.Select(e => e.Description));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDTO model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return Unauthorized("Špatný email nebo heslo.");

            var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, false, false);

            if (result.Succeeded)
                return Ok();

            return Unauthorized("Špatný email nebo heslo.");
        }

        [HttpGet("me")]
        public IActionResult CheckAuth()
        {
            if (User?.Identity?.IsAuthenticated ?? false)
            {
                var roles = User.Claims
                .Where(c => c.Type == ClaimTypes.Role)
                .Select(c => c.Value)
                .ToList();

                return Ok(new {isAuthenticated = true, roles } );
            }
            return Unauthorized();
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync(); 
            return Ok();
        }
    }


}

