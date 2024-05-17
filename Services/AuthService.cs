using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using database.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Models;

namespace Services
{
    public class AuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        public async Task<IdentityResult> RegisterAsync(RegisterModel model)
        {
            var user = new User { UserName = model.Username };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Worker");
            }

            return result;
        }

        public async Task<AuthenticatedResponse?> LoginAsync(LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
                throw new CustomBadRequest("Invalid credentials");

            if (await _userManager.CheckPasswordAsync(user, model.Password))
            {
                Console.WriteLine("PROSHLO");
                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();
                Console.WriteLine("PROSHLO GLUBOKO SUKA");
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.Now.ToUniversalTime().AddDays(7);
                await _userManager.UpdateAsync(user);
                Console.WriteLine("GLUBOKO SUKA");
                return new AuthenticatedResponse
                {
                    Token = token,
                    RefreshToken = refreshToken
                };
            }

            return null;
        }

        public async Task<AuthenticatedResponse?> RefreshTokenAsync(string token)
        {
            var principal = GetPrincipalFromExpiredToken(token);
            var username = principal.Identity.Name;
            var user = await _userManager.FindByNameAsync(username);

            if (user == null || user.RefreshTokenExpiryTime <= DateTime.Now)
                return null;

            var newJwtToken = GenerateJwtToken(user);
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);

            await _userManager.UpdateAsync(user);

            return new AuthenticatedResponse
            {
                Token = newJwtToken,
                RefreshToken = newRefreshToken
            };
        }

        public async Task<User?> FindByUsernameAsync(string username)
        {
            return await _userManager.FindByNameAsync(username);
        }

        private string GenerateJwtToken(User user)
        {
            var userRoles = _userManager.GetRolesAsync(user).Result;
            if (userRoles.Count == 0)
                throw new InvalidOperationException("User has no roles");
            var roleClaims = userRoles.Select(role => new Claim(ClaimTypes.Role, role)).ToList();
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        }.Union(roleClaims);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("SECRET_KEY") ?? throw new InvalidOperationException("No secret key found")));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);


            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidAudience = _configuration["Jwt:Issuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]))
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;

            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }
    }

}