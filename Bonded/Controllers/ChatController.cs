using Bonded.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace Bonded.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatController(ApplicationDbContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        public IActionResult Index()
        {
            return View();
        }

        // Získání všech chatů uživatele
        [HttpGet("list")]
        public async Task<IActionResult> GetMyChats()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var chats = await _context.ChatUsers
                .Where(cu => cu.UserId == userId)
                .Include(cu => cu.Chat)
                    .ThenInclude(c => c.ChatUsers)
                        .ThenInclude(cu => cu.User.UserProfile)
                .Include(cu => cu.Chat.Messages)
                .ToListAsync();

            var result = chats.Select(cu => {
                var chat = cu.Chat;
                var lastMessage = chat.Messages.OrderByDescending(m => m.SentAt).FirstOrDefault();

                return new
                {
                    ChatId = chat.Id,
                    Participants = chat.ChatUsers
                        .Where(u => u.UserId != userId)
                        .Select(u => new
                        {
                            u.UserId,
                            u.User.UserProfile.FirstName,
                            u.User.UserProfile.ProfileImageUrl
                        }),
                    LastMessage = lastMessage != null ? new
                    {
                        lastMessage.Content,
                        lastMessage.SentAt,
                        lastMessage.SenderId
                    } : null
                };
            });

            return Ok(result);
        }


        // Získání všech zpráv v chatu
        [HttpGet("{chatId}")]
        public async Task<IActionResult> GetMessages(int chatId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var chat = await _context.Chats
                .Include(c => c.ChatUsers)
                    .ThenInclude(cu => cu.User.UserProfile)
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c => c.Id == chatId);

            if (chat == null) return NotFound();

            var isParticipant = chat.ChatUsers.Any(cu => cu.UserId == userId);
            if (!isParticipant) return Forbid();

            var otherUser = chat.ChatUsers.FirstOrDefault(cu => cu.UserId != userId);

            var result = new
            {
                chatId = chat.Id,
                partner = otherUser != null ? new
                {
                    userId = otherUser.UserId,
                    name = otherUser.User.UserProfile.FirstName,
                    image = otherUser.User.UserProfile.ProfileImageUrl
                } : null,
                messages = chat.Messages
                    .OrderBy(m => m.SentAt)
                    .Select(m => new {
                        m.Id,
                        m.Content,
                        m.SentAt,
                        m.SenderId
                    })
                    .ToList()
            };

            return Ok(result);
        }


        // Odeslání zprávy
        [HttpPost("{chatId}/message")]
        public async Task<IActionResult> SendMessage(int chatId, [FromBody] string content)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var isParticipant = await _context.ChatUsers
                .AnyAsync(cu => cu.ChatId == chatId && cu.UserId == userId);

            if (!isParticipant) return Forbid();

            var message = new Message
            {
                ChatId = chatId,
                SenderId = userId,
                Content = content,
                SentAt = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // Pošli zprávu přes SignalR
            await _hubContext.Clients.Group(chatId.ToString()).SendAsync("ReceiveMessage", userId, content, message.Id, message.SentAt);

            return Ok();
        }

        // Zahájení nového chatu nebo získání existujícího
        [HttpPost("start/{recipientId}")]
        public async Task<IActionResult> StartChat(string recipientId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // najdi existující chat
            var chat = await _context.Chats
                .Include(c => c.ChatUsers)
                .FirstOrDefaultAsync(c =>
                    c.ChatUsers.Count == 2 &&
                    c.ChatUsers.Any(u => u.UserId == userId) &&
                    c.ChatUsers.Any(u => u.UserId == recipientId)
                );

            if (chat == null)
            {
                chat = new Chat();
                _context.Chats.Add(chat);
                await _context.SaveChangesAsync();

                _context.ChatUsers.AddRange(
                    new ChatUser { ChatId = chat.Id, UserId = userId },
                    new ChatUser { ChatId = chat.Id, UserId = recipientId }
                );
                await _context.SaveChangesAsync();
            }

            return Ok(new { chatId = chat.Id });
        }
    }
}

