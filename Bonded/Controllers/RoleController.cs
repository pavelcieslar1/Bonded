using Bonded.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Bonded.Controllers
{
    public class AssignRoleRequest
    {
        public string UserId { get; set; }
        public string RoleName { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : Controller
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;

        public RoleController(RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        // Vytvoří novou roli (Standard, Premium, Admin)
        [HttpPost("create")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> CreateRole([FromBody] string roleName)
        {
            if (await _roleManager.RoleExistsAsync(roleName))
                return BadRequest("Role už existuje.");

            var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
            if (result.Succeeded)
                return Ok("Role byla vytvořena.");
            return BadRequest(result.Errors);
        }

        // Přiřadí roli uživateli podle jeho emailu (nebo Id)
        [HttpPost("assign")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleRequest req)
        {

            var user = await _userManager.FindByIdAsync(req.UserId);
            if (user == null)
                return NotFound("Uživatel nenalezen.");

            var userRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, userRoles);

            if (!await _roleManager.RoleExistsAsync(req.RoleName))
                return BadRequest("Role neexistuje.");

            var result = await _userManager.AddToRoleAsync(user, req.RoleName);
            if (result.Succeeded)
                return Ok("Role byla přiřazena uživateli.");
            return BadRequest(result.Errors);
        }
    }
}
