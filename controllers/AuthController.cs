using System.Security.Claims;
using database.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models;
using Services;

[Route("api/[controller]")]
[ApiController]
public class AuthController : Controller
{
    private readonly IConfiguration _configuration;

    private readonly AuthService _authService;

    public AuthController(IConfiguration configuration, AuthService authService)
    {
        _configuration = configuration;
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        try
        {
            var result = await _authService.RegisterAsync(model);
            if (result.Succeeded)
            {
                return Ok();
            }
            throw new CustomBadRequest("Invalid credentials");
        }
        catch (Exception)
        {
            throw;
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        try
        {
            var response = await _authService.LoginAsync(model);
            if (response != null)
            {
                return Ok(new { response });
            }
              throw new CustomBadRequest("Invalid credentials");
        }
        catch (Exception)
        {
            throw;
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string refreshToken)
    {
        try
        {
            var response = await _authService.RefreshTokenAsync(refreshToken);
            if (response != null)
            {
                return Ok(response);
            }
            throw new CustomUnauthorized("Invalid token");
        }
        catch (Exception)
        {
            throw;
        }
    }
}