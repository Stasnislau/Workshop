using database.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
    }
}