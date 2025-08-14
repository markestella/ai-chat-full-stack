using ChatbotApi.Data;
using ChatbotApi.Dto;
using ChatbotApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatbotApi.Services
{
    public class ChatService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ChatService> _logger;

        public ChatService(ApplicationDbContext context, ILogger<ChatService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<ChatSessionDto>> GetUserSessionsAsync(string userId)
        {
            return await _context.ChatSessions
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.CreatedAt)
                .Select(s => new ChatSessionDto
                {
                    Id = s.Id,
                    Title = s.Title,
                    CreatedAt = s.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<ChatSessionDto> CreateSessionAsync(string userId, string title)
        {
            var session = new ChatSession
            {
                UserId = userId,
                Title = title
            };

            _context.ChatSessions.Add(session);
            await _context.SaveChangesAsync();

            return new ChatSessionDto
            {
                Id = session.Id,
                Title = session.Title,
                CreatedAt = session.CreatedAt
            };
        }
        
        public async Task<int> DeleteSessionsAsync(IEnumerable<Guid> sessionIds, string userId)
        {
            if (sessionIds == null || !sessionIds.Any())
                return 0;

            var sessions = await _context.ChatSessions
                .Where(s => sessionIds.Contains(s.Id) && s.UserId == userId)
                .ToListAsync();

            if (!sessions.Any())
                return 0;

            _context.ChatSessions.RemoveRange(sessions);
            return await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<MessageDto>> GetSessionMessagesAsync(Guid sessionId, string userId)
        {
            return await _context.Messages
                .Where(m => m.SessionId == sessionId && m.Session.UserId == userId)
                .OrderBy(m => m.Timestamp)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    Content = m.Content,
                    IsUserMessage = m.IsUserMessage,
                    Timestamp = m.Timestamp
                })
                .ToListAsync();
        }

        public async Task<MessageDto> AddUserMessageAsync(Guid sessionId, string userId, string content)
        {
            var message = new Message
            {
                SessionId = sessionId,
                Content = content,
                IsUserMessage = true,
                Timestamp = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            
            await _context.SaveChangesAsync();

            return new MessageDto
            {
                Id = message.Id,
                Content = message.Content,
                IsUserMessage = true,
                Timestamp = message.Timestamp
            };
        }

        public async Task<MessageDto> AddBotResponseAsync(Guid sessionId, string response)
        {
            var message = new Message
            {
                SessionId = sessionId,
                Content = response,
                IsUserMessage = false,
                Timestamp = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return new MessageDto
            {
                Id = message.Id,
                Content = message.Content,
                IsUserMessage = false,
                Timestamp = message.Timestamp
            };
        }
    }
}