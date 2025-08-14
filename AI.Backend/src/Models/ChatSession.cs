using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatbotApi.Models;

public class ChatSession
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = "New Chat";
    
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [ForeignKey("User")]
    public string UserId { get; set; }
    public User User { get; set; }
    
    public List<Message> Messages { get; set; } = new();
}