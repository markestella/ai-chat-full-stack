using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ChatbotApi.Models;

namespace ChatbotApi.Models;

public class Message
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public string Content { get; set; }
    
    [Required]
    public bool IsUserMessage { get; set; }
    
    [Required]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    
    [ForeignKey("Session")]
    public Guid SessionId { get; set; }
    public ChatSession? Session { get; set; }
}