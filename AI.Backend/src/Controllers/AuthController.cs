using ChatbotApi.Dto;
using ChatbotApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChatbotApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly ILogger<AuthController> _logger;
        private readonly IWebHostEnvironment _env;

        public AuthController(AuthService authService, ILogger<AuthController> logger, IWebHostEnvironment env)
        {
            _authService = authService;
            _logger = logger;
            _env = env;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var result = await _authService.RegisterAsync(registerDto);

            if (!result.Success)
            {
                if (result.Errors.Contains("Email is already registered"))
                    return Conflict(new { Errors = result.Errors }); 

                return BadRequest(new { Errors = result.Errors });
            }

            return Ok(new { Message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var result = await _authService.LoginAsync(loginDto);
                
                if (!result.Success)
                {
                    return Unauthorized(new { Errors = result.Errors });
                }

                var sameSiteMode = _env.IsDevelopment() ? SameSiteMode.Strict : SameSiteMode.None;

                Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = sameSiteMode,
                    Expires = DateTime.UtcNow.AddDays(7)
                });

                return Ok(new 
                { 
                    Token = result.Token,
                    ExpiresIn = result.ExpiresIn 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { Error = "Internal server error" });
            }
        }
        
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            try
            {
                var refreshToken = Request.Cookies["refreshToken"];
                if (string.IsNullOrEmpty(refreshToken))
                    return Unauthorized(new { Error = "Refresh token missing" });

                var result = await _authService.RefreshTokenAsync(refreshToken);

                if (!result.Success)
                {
                    return Unauthorized(new { Errors = result.Errors });
                }

                var sameSiteMode = _env.IsDevelopment() ? SameSiteMode.Strict : SameSiteMode.None;

                Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = sameSiteMode,
                    Expires = DateTime.UtcNow.AddDays(7)
                });

                return Ok(new 
                { 
                    Token = result.Token,
                    ExpiresIn = result.ExpiresIn
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return StatusCode(500, new { Error = "Internal server error" });
            }
        }
    }
}
