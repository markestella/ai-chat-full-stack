using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ChatbotApi.Models;
using ChatbotApi.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ChatbotApi.Services
{
    public class AuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<User> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<AuthResult> RegisterAsync(RegisterDto registerDto)
        {
            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = new[] { "Email is already registered" }
                };
            }
            
            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = new[] { "Passwords do not match" }
                };
            }
            
            var user = new User { UserName = registerDto.UserName, Email = registerDto.Email };
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = result.Errors.Select(e => e.Description)
                };
            }

            return new AuthResult { Success = true };
        }
        
        public async Task<AuthResult> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = new[] { "User not found" }
                };
            }

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = result.Errors.Select(e => e.Description)
                };
            }

            return new AuthResult { Success = true };
        }

        public async Task<AuthResult> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = new[] { "User not found" }
                };
            }

            var isValidPassword = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!isValidPassword)
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = new[] { "Invalid credentials" }
                };
            }

            // Generate Access Token
            var token = GenerateJwtToken(user);

            // Generate Refresh Token
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); // 7 days refresh token
            await _userManager.UpdateAsync(user);

            return new AuthResult
            {
                Success = true,
                Token = token,
                RefreshToken = refreshToken,
                ExpiresIn = 3600 // 1 hour
            };
        }
        
        public async Task<AuthResult> RefreshTokenAsync(string refreshToken)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = new[] { "Invalid or expired refresh token" }
                };
            }

            var newAccessToken = GenerateJwtToken(user);
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            return new AuthResult
            {
                Success = true,
                Token = newAccessToken,
                RefreshToken = newRefreshToken,
                ExpiresIn = 3600
            };
        }

        public async Task<UserDto.UserProfileDto?> GetUserProfileAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return null;

            return new UserDto.UserProfileDto
            {
                Email = user.Email,
                UserName = user.UserName,
                UserId = userId
            };
        }
        
        public async Task<AuthResult> UpdateUserProfileAsync(string userId, UserDto.UpdateProfileDto profileDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = new[] { "User not found" }
                };
            }

            bool requiresUpdate = false;

            if (!string.Equals(user.UserName, profileDto.UserName, StringComparison.OrdinalIgnoreCase))
            {
                var existingUser = await _userManager.FindByNameAsync(profileDto.UserName);
                if (existingUser != null && existingUser.Id != user.Id)
                {
                    return new AuthResult
                    {
                        Success = false,
                        Errors = new[] { "Username is already taken" }
                    };
                }

                user.UserName = profileDto.UserName;
                requiresUpdate = true;
            }

            if (!string.Equals(user.Email, profileDto.Email, StringComparison.OrdinalIgnoreCase))
            {
                var existingEmailUser = await _userManager.FindByEmailAsync(profileDto.Email);
                if (existingEmailUser != null && existingEmailUser.Id != user.Id)
                {
                    return new AuthResult
                    {
                        Success = false,
                        Errors = new[] { "Email is already taken" }
                    };
                }

                user.Email = profileDto.Email;
                requiresUpdate = true;
            }

            if (requiresUpdate)
            {
                var updateResult = await _userManager.UpdateAsync(user);

                if (!updateResult.Succeeded)
                {
                    return new AuthResult
                    {
                        Success = false,
                        Errors = updateResult.Errors.Select(e => e.Description)
                    };
                }
            }

            return new AuthResult
            {
                Success = true,
                UserName = user.UserName,
                Email = user.Email
            };
        }

        
        public async Task<AuthResult> ChangeUserPasswordAsync(string userId, UserDto.UpdatePasswordDto passwordDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = new[] { "User not found" }
                };
            }

            if (passwordDto.NewPassword != passwordDto.ConfirmNewPassword)
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = new[] { "Passwords do not match" }
                };
            }

            var passwordChangeResult = await _userManager.ChangePasswordAsync(
                user,
                passwordDto.CurrentPassword,
                passwordDto.NewPassword
            );

            if (!passwordChangeResult.Succeeded)
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = passwordChangeResult.Errors.Select(e => e.Description)
                };
            }

            return new AuthResult
            {
                Success = true,
                UserName = user.UserName,
                Email = user.Email
            };
        }
        
        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id),
                new(JwtRegisteredClaimNames.Email, user.Email),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(ClaimTypes.NameIdentifier, user.Id)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddHours(Convert.ToDouble(_configuration["Jwt:ExpireHours"]));

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

    }

    public class AuthResult
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public int ExpiresIn { get; set; }
        public IEnumerable<string> Errors { get; set; }

        public string UserName { get; set; }
        public string Email { get; set; }
    }

}