using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bonded.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HobbyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public HobbyController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetHobbies()
        {
            var hobbies = await _context.Hobbies
                .Select(h => new { h.Id, h.Name })
                .ToListAsync();
            return Ok(hobbies);
        }
    }

}
