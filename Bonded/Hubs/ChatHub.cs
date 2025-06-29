using Microsoft.AspNetCore.SignalR;
using Bonded.Models;
using Microsoft.EntityFrameworkCore;
using Bonded;

public class ChatHub : Hub
{
    private readonly ApplicationDbContext _context;

    public ChatHub(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SendMessage(string chatId, string user, string message)
    {
        // Ulož zprávu do databáze
        var messageEntity = new Message
        {
            ChatId = int.Parse(chatId),
            SenderId = user,
            Content = message,
            SentAt = DateTime.UtcNow
        };

        _context.Messages.Add(messageEntity);
        await _context.SaveChangesAsync();

        // Pošli zprávu všem klientům ve skupině (chatu)
        await Clients.Group(chatId).SendAsync("ReceiveMessage", user, message, messageEntity.Id, messageEntity.SentAt);
    }

    public override async Task OnConnectedAsync()
    {
        // Přidej uživatele do skupiny podle chatId
        var chatId = Context.GetHttpContext().Request.Query["chatId"];
        if (!string.IsNullOrEmpty(chatId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatId);
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // Odeber uživatele ze všech skupin při odpojení
        var chatId = Context.GetHttpContext().Request.Query["chatId"];
        if (!string.IsNullOrEmpty(chatId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatId);
        }
        await base.OnDisconnectedAsync(exception);
    }
}