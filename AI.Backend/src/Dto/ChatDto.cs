using System.ComponentModel.DataAnnotations;

namespace ChatbotApi.Dto
{
    public class ChatSessionDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int MessageCount { get; set; }
    }

    public class MessageDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsUserMessage { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class SendMessageDto
    {
        [Required]
        [StringLength(1000, MinimumLength = 1)]
        public string Content { get; set; } = string.Empty;
        public string? UserId { get; set; }
    }

    public class CreateSessionDto
    {
        public string Title { get; set; }
        public string? UserId { get; set; }
    }
}