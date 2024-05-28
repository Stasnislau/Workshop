using database;
using database.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models;
using Services;
using System.Security.Claims;
namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserController : Controller
    {
        private readonly UserService _userService;
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _context;


        public UserController(UserService userService, UserManager<User> userManager, ApplicationDbContext context)
        {
            _userService = userService;
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("specific")]
        public async Task<IActionResult> GetCurrentUserInfo()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userService.GetUserByIdAsync(userId);
            var timeSlots = _context.TimeSlots.Where(ts => ts.UserId == userId).ToList();
            if (user != null)
            {
                return Ok(new UserInfoResponse
                {
                    Username = user.UserName,
                    HourlyRate = user.HourlyRate,
                    Id = user.Id,
                    TimeSlots = timeSlots.ToArray()
                });
            }
            throw new CustomBadRequest("User not found");
        }

        [HttpPut("update/password")]
        public async Task<IActionResult> ChangeCurrentUserPassword([FromBody] ChangePasswordModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _userService.ChangePasswordAsync(userId, model.CurrentPassword, model.NewPassword);
            if (result.Succeeded)
            {
                return Ok(
                    new
                    {
                        Success = true,
                        Message = "Password has been changed"
                    }
                );
            }
            return BadRequest(result.Errors);
        }

        [HttpGet("all")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await _userService.GetAllEmployeesAsync();
            return Ok(employees.Select(e => new { e.UserName, e.Id }));
        }

        [HttpDelete("specific/{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> DeleteEmployee(string id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest(result.Errors);
        }
    }
}
