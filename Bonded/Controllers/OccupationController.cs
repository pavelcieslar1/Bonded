using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bonded.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OccupationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public OccupationController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetOccupation()
        {
            var hobbies = await _context.Occupations
                .Select(h => new { h.Id, h.Name })
                .ToListAsync();
            return Ok(hobbies);
        }
    }
}
