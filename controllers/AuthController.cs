using System.Security.Claims;
using car_workshop_react.Migrations;
using database.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
            var response = await _authService.LoginAsync(model, HttpContext);
            if (response != null)
            {
                return Ok(response);
            }
            throw new CustomBadRequest("Invalid credentials");
        }
        catch (Exception)
        {
            throw;
        }
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        try
        {
            // Console.WriteLine("Refreshing token" + Request.Cookies.Count);
            // foreach (var cookie in Request.Cookies)
            // {
            //     Console.WriteLine(cookie.Key + " " + cookie.Value);
            // }
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                throw new CustomBadRequest("Invalid token");
            }
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

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        try
        {
            var response = await _authService.LogoutAsync(User.Identity?.Name ?? throw new InvalidOperationException("No user found"));
            if (response)
            {
                return Ok();
            }
            throw new CustomBadRequest("Unable to logout user");
        }
        catch (Exception)
        {
            throw;
        }
    }
}