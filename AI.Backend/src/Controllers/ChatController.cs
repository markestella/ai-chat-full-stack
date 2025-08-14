using System.Security.Claims;
using ChatbotApi.Dto;
using ChatbotApi.Services;
using ChatbotApi.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace ChatbotApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;
        private readonly GeminiService _geminiService;
        private readonly ILogger<ChatController> _logger;
        private readonly Guid _guestUserId;

        public ChatController(
            ChatService chatService,
            GeminiService geminiService,
            ILogger<ChatController> logger,
            IOptions<GuestUserOptions> guestUserOptions)
        {
            _chatService = chatService;
            _geminiService = geminiService;
            _logger = logger;
            _guestUserId = guestUserOptions.Value.Id;
        }

        // Authenticated user endpoints

        [HttpGet("sessions")]
        public async Task<ActionResult<IEnumerable<ChatSessionDto>>> GetSessions()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var sessions = await _chatService.GetUserSessionsAsync(userId);
                return Ok(sessions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting chat sessions");
                return StatusCode(500, new { Error = "Failed to retrieve chat sessions" });
            }
        }

        [HttpPost("sessions")]
        public async Task<ActionResult<ChatSessionDto>> CreateSession([FromBody] CreateSessionDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Error = "Invalid session" });

                var session = await _chatService.CreateSessionAsync(userId, dto.Title);

                return CreatedAtAction(nameof(GetSessions), new { id = session.Id }, session);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating chat session");
                return StatusCode(500, new { Error = "Failed to create chat session" });
            }
        }
        
        [HttpDelete("sessions/{sessionId}")]
        public async Task<IActionResult> DeleteSession(Guid sessionId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { Error = "Invalid session" });

            var deletedCount = await _chatService.DeleteSessionsAsync(new[] { sessionId }, userId);

            if (deletedCount == 0)
                return NotFound(new { Error = "Session not found or you do not have permission to delete it" });

            return Ok(new { Message = "Session and its messages deleted successfully" });
        }

        [HttpDelete("sessions")]
        public async Task<IActionResult> DeleteMultipleSessions([FromBody] IEnumerable<Guid> sessionIds)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { Error = "Invalid session" });

            var deletedCount = await _chatService.DeleteSessionsAsync(sessionIds, userId);

            if (deletedCount == 0)
                return NotFound(new { Error = "No sessions found or you do not have permission to delete them" });

            return Ok(new { Message = $"{deletedCount} session(s) and their messages deleted successfully" });
        }
        
        [HttpGet("sessions/{sessionId}/messages")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessages(Guid sessionId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var messages = await _chatService.GetSessionMessagesAsync(sessionId, userId);
                return Ok(messages);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting messages");
                return StatusCode(500, new { Error = "Failed to retrieve messages" });
            }
        }

        [HttpPost("sessions/{sessionId}/messages")]
        public async Task<ActionResult<MessageDto>> SendMessage(Guid sessionId, [FromBody] SendMessageDto messageDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Error = "Invalid session" });

                var userMessage = await _chatService.AddUserMessageAsync(sessionId, userId, messageDto.Content);
                var botResponse = await _geminiService.GenerateResponseAsync(messageDto.Content);
                var botMessage = await _chatService.AddBotResponseAsync(sessionId, botResponse);

                return Ok(botMessage);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message");
                return StatusCode(500, new { Error = "Failed to process message" });
            }
        }

        // Guest endpoints

        [AllowAnonymous]
        [HttpPost("guest/sessions")]
        public async Task<ActionResult<ChatSessionDto>> CreateGuestSession([FromBody] CreateSessionDto dto)
        {
            try
            {
                if (!Guid.TryParse(dto.UserId, out var userId) || userId != _guestUserId)
                    return Unauthorized(new { Error = "Invalid guest userId" });

                var session = await _chatService.CreateSessionAsync(_guestUserId.ToString(), dto.Title);
                return CreatedAtAction(nameof(GetMessages), new { sessionId = session.Id }, session);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating guest chat session");
                return StatusCode(500, new { Error = "Failed to create guest session" });
            }
        }
        
        [AllowAnonymous]
        [HttpGet("guest/sessions/{sessionId}/messages")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetGuestMessages(Guid sessionId)
        {
            try
            {
                var messages = await _chatService.GetSessionMessagesAsync(sessionId, userId: _guestUserId.ToString());
                return Ok(messages);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting guest messages");
                return StatusCode(500, new { Error = "Failed to retrieve guest messages" });
            }
        }

        [AllowAnonymous]
        [HttpPost("guest/sessions/{sessionId}/messages")]
        public async Task<ActionResult<MessageDto>> SendGuestMessage(Guid sessionId, [FromBody] SendMessageDto messageDto)
        {
            try
            {
                if (!Guid.TryParse(messageDto.UserId, out var userId) || userId != _guestUserId)
                    return Unauthorized(new { Error = "Invalid guest userId" });

                var userMessage = await _chatService.AddUserMessageAsync(sessionId, _guestUserId.ToString(), messageDto.Content);
                var botResponse = await _geminiService.GenerateResponseAsync(messageDto.Content);
                var botMessage = await _chatService.AddBotResponseAsync(sessionId, botResponse);

                return Ok(botMessage);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending guest message");
                return StatusCode(500, new { Error = "Failed to process guest message" });
            }
        }
        
        [AllowAnonymous]
        [HttpPost("guest/sessions/delete/{sessionId}")]
        public async Task<IActionResult> DeleteGuestSession(Guid sessionId)
        {
            var userId = _guestUserId; 

            var deletedCount = await _chatService.DeleteSessionsAsync(new[] { sessionId }, userId.ToString());

            if (deletedCount == 0)
                return NotFound(new { Error = "Session not found or you do not have permission to delete it" });

            return Ok(new { Message = "Session and its messages deleted successfully" });
        }

        // Sample response testing

        [AllowAnonymous]
        [HttpPost("generate-sample")]
        public async Task<IActionResult> GenerateSample([FromBody] string prompt)
        {
            try
            {
                var response = await _geminiService.GenerateResponseAsync(prompt);
                return Ok(new { response });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating sample response");
                return StatusCode(500, new { Error = "Gemini API test failed" });
            }
        }
    }
}
