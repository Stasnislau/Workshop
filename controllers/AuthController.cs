using System.Security.Claims;
using database.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class AuthController : Controller
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    // [HttpPost("register")]
    // public async Task<IActionResult> Register([FromBody] RegisterModel model)
    // {
    //     var user = new User { UserName = model.Username };
    //     var result = await _userManager.CreateAsync(user, model.Password);

    //     if (result.Succeeded)
    //     {
    //         await _userManager.AddToRoleAsync(user, model.Role);
    //         return Ok();
    //     }

    //     return BadRequest(result.Errors);
    // }

    // [HttpPost("login")]
    // public async Task<IActionResult> Login([FromBody] LoginModel model)
    // {
    //     var user = await _userManager.FindByNameAsync(model.Username);
    //     if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
    //     {
    //         var token = GenerateJwtToken(user);
    //         return Ok(new { token });
    //     }

    //     return Unauthorized();
    // }
}