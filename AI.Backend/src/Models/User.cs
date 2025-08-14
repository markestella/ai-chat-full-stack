using Microsoft.AspNetCore.Identity;

namespace ChatbotApi.Models;

public class User : IdentityUser
{
    public List<ChatSession> ChatSessions { get; set; } = new();
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
}