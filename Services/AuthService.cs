using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using database.Models;
using Microsoft.AspNetCore.Authorization;
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
            if (await _userManager.FindByNameAsync(model.Username) != null)
                throw new CustomBadRequest("Username already exists");
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Worker");
            }
            else if (result.Errors.Any())
            {
                throw new CustomBadRequest(result.Errors.First().Description);
            }

            return result;
        }

        public async Task<AuthenticatedResponse?> LoginAsync(LoginModel model, HttpContext httpContext)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
                throw new CustomBadRequest("Invalid credentials");

            if (await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var token = GenerateJwtToken(user);
                var refreshToken = GenerateJwtToken(user, true);
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.Now.ToUniversalTime().AddDays(7);
                await _userManager.UpdateAsync(user);
                httpContext.Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddDays(7)
                });
                return new AuthenticatedResponse
                {
                    Token = token,
                    RefreshToken = refreshToken
                };
            }

            return null;
        }

        public async Task<bool> LogoutAsync( HttpContext httpContext)
        {
            var user = await _userManager.GetUserAsync(httpContext.User);
            user.RefreshToken = "";
            httpContext.Response.Cookies.Delete("refreshToken");
            user.RefreshTokenExpiryTime = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);
            return true;
        }

        public async Task<AuthenticatedResponse?> RefreshTokenAsync(string token)
        {
            var principal = GetPrincipalFromExpiredToken(token, true);
            var username = principal.Identity.Name;
            var user = await _userManager.FindByNameAsync(username);

            if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                return null;

            var newJwtToken = GenerateJwtToken(user);
            var newRefreshToken = GenerateJwtToken(user, true);

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

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



        private string GenerateJwtToken(User user, bool isRefreshToken = false)
        {
            string secret = isRefreshToken ? Environment.GetEnvironmentVariable("REFRESH_SECRET_KEY") : Environment.GetEnvironmentVariable("SECRET_KEY");
            if (secret == null)
                throw new InvalidOperationException("No secret key found");
            var userRoles = _userManager.GetRolesAsync(user).Result;
            if (userRoles.Count == 0)
                throw new InvalidOperationException("User has no roles");
            var roleClaims = userRoles.Select(role => new Claim(ClaimTypes.Role, role)).ToList();
            var claims = new[]
            {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        }.Union(roleClaims);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);


            var token = new JwtSecurityToken(
                issuer: "*",
                audience: "*",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token, bool isRefreshToken = false)
        {
            var secret = isRefreshToken ? Environment.GetEnvironmentVariable("REFRESH_SECRET_KEY") : Environment.GetEnvironmentVariable("SECRET_KEY");
            if (secret == null)
                throw new InvalidOperationException("No secret key found");
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = true,
                ValidIssuer = "*",
                ValidAudience = "*",
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
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