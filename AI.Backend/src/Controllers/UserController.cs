using System.Security.Claims;
using ChatbotApi.Dto;
using ChatbotApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatbotApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly ILogger<UserController> _logger;

        public UserController(AuthService authService, ILogger<UserController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpGet("profile")]
        public async Task<ActionResult<UserDto.UserProfileDto>> GetProfile()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await _authService.GetUserProfileAsync(userId);
                
                if (user == null)
                {
                    return NotFound();
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user profile");
                return StatusCode(500, new { Error = "Failed to retrieve profile" });
            }
        }
        
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UserDto.UpdateProfileDto profileDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Error = "User not authenticated" });

                var result = await _authService.UpdateUserProfileAsync(userId, profileDto);

                if (!result.Success)
                {
                    if (result.Errors != null && result.Errors.Contains("Username is already taken"))
                        return Conflict(new { Errors = result.Errors });

                    if (result.Errors != null && result.Errors.Contains("Email is already taken"))
                        return Conflict(new { Errors = result.Errors });

                    return BadRequest(new { Errors = result.Errors });
                }

                return Ok(new
                {
                    success = true,
                    userName = profileDto.UserName,
                    email = profileDto.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating profile");
                return StatusCode(500, new { Error = "Failed to update profile" });
            }
        }
        
        [HttpDelete("delete/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var result = await _authService.DeleteUserAsync(userId);

            if (!result.Success)
            {
                if (result.Errors.Contains("User not found"))
                    return NotFound(new { Errors = result.Errors });

                return BadRequest(new { Errors = result.Errors });
            }

            return Ok(new { Message = "User deleted successfully" });
        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] UserDto.UpdatePasswordDto passwordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Error = "User not authenticated" });

                var result = await _authService.ChangeUserPasswordAsync(userId, passwordDto);

                if (!result.Success)
                    return BadRequest(new { Errors = result.Errors });

                return Ok(new { success = true, message = "Password changed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password");
                return StatusCode(500, new { Error = "Failed to change password" });
            }
        }
    }
}