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
    public class TicketController : Controller
    {
        private readonly TicketService _ticketService;
        private readonly UserManager<User> _userManager;

        public TicketController(TicketService ticketService, UserManager<User> userManager)
        {
            _ticketService = ticketService;
            _userManager = userManager;
        }

        [HttpGet("specific/:id")]
        public async Task<IActionResult> GetSpecificTicket(int id)
        {
            var ticket = await _ticketService.GetTicketByIdAsync(id);
            if (ticket != null)
            {
                return Ok(ticket);
            }
            return NotFound();

        }


        [HttpGet("user/all")]
        public async Task<IActionResult> GetAllTicketsForUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var tickets = new List<Ticket>();
            if (User.IsInRole("Admin"))
            {
                tickets = await _ticketService.GetAllTicketsAsync();
                return Ok(tickets);
            }
            tickets = await _ticketService.GetTicketsByUserIdAsync(userId);
            return Ok(tickets);
        }

        [HttpDelete("specific/{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var result = await _ticketService.DeleteTicketAsync(id);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest(result.Errors);
        }
    }
}
