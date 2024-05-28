using System.Security.Claims;
using database.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models;
using Services;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class TimeSlotController : Controller
    {
        private readonly TimeSlotService _timeSlotService;
        private readonly UserManager<User> _userManager;

        public TimeSlotController(TimeSlotService timeSlotService, UserManager<User> userManager)
        {
            _timeSlotService = timeSlotService;
            _userManager = userManager;
        }

        [HttpGet("specific/{id}")]
        public async Task<IActionResult> GetSpecificTimeSlot(int id)
        {
            try
            {
                var timeSlot = await _timeSlotService.GetTimeSlotByIdAsync(id);
                if (timeSlot != null)
                {
                    return Ok(timeSlot);
                }
                return NotFound();
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllTimeSlots()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var timeSlots = await _timeSlotService.GetAllTimeSlotsAsync(userId);
                return Ok(timeSlots);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost("add/{ticketId}")]
        public async Task<IActionResult> AddTimeSlot([FromBody] TimeSlotModel timeSlotModel, int ticketId)
        {
            try
            {  
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var timeSlot = await _timeSlotService.AddTimeSlotAsync(timeSlotModel, ticketId, userId);
                return Ok(timeSlot);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateTimeSlot([FromBody] TimeSlotModel timeSlotModel, int id)
        {
            try
            {
                var timeSlot = await _timeSlotService.UpdateTimeSlotAsync(timeSlotModel, id);
                return Ok(timeSlot);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteTimeSlot(int id)
        {
            try
            {
                var result = await _timeSlotService.DeleteTimeSlotAsync(id);
                if (result.Succeeded)
                {
                    return Ok(new
                    {
                        Success = true,
                        Message = "Time slot has been deleted"
                    });
                }
                return BadRequest(result.Errors);
            }
            catch (Exception)
            {
                throw;
            }
        }

        
    }


}