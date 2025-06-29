using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bonded.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionnaireController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionnaireController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Vrátí jednu otázku podle pořadí (např. ?order=1)
        [HttpGet("question")]
        public async Task<IActionResult> GetQuestion([FromQuery] int ordered)
        {
            var question = await _context.QuestionnaireQuestions
                .Include(q => q.Category)
                .Include(q => q.AnswerOptions.OrderBy(o => o.DisplayOrder))
                .FirstOrDefaultAsync(q => q.DisplayOrder == ordered);

            if (question == null)
                return NotFound();

            return Ok(new
            {
                question.Id,
                question.Text,
                Category = question.Category.Name,
                question.DisplayOrder,
                Answers = question.AnswerOptions.Select(opt => new {
                    opt.Id,
                    opt.Label,
                    opt.Score,
                    opt.DisplayOrder
                })
            });
        }

        // Vrátí všechny otázky.
        [HttpGet("questions")]
        public async Task<IActionResult> GetAllQuestions()
        {
            var questions = await _context.QuestionnaireQuestions
                .Include(q => q.Category)
                .Include(q => q.AnswerOptions.OrderBy(o => o.DisplayOrder))
                .OrderBy(q => q.DisplayOrder)
                .ToListAsync();

            return Ok(questions.Select(q => new {
                q.Id,
                q.Text,
                Category = q.Category.Name,
                CategoryDescription = q.Category.Description,
                q.DisplayOrder,
                Answers = q.AnswerOptions.Select(opt => new {
                    opt.Id,
                    opt.Label,
                    opt.Score,
                    opt.DisplayOrder
                })
            }));
        }
    }

}
