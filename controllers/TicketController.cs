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

        [HttpGet("specific/{id}")]
        public async Task<IActionResult> GetSpecificTicket(int id)
        {
            try
            {
                var ticket = await _ticketService.GetTicketByIdAsync(id);
                if (ticket != null)
                {
                    return Ok(ticket);
                }
                return NotFound();
            }
            catch (Exception)
            {
                throw;
            }
        }


        [HttpGet("user/all")]
        public async Task<IActionResult> GetAllTicketsForUser()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var tickets = new List<Ticket>();
                tickets = await _ticketService.GetTicketsByUserIdAsync(userId);
                return Ok(tickets);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllTickets()
        {
            try
            {
                var tickets = new List<Ticket>();
                tickets = await _ticketService.GetAllTicketsAsync();
                return Ok(tickets);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateTicket([FromBody] TicketModel ticket)
        {
            try
            {
                string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var result = await _ticketService.CreateTicketAsync(ticket, userId);
                if (result.Succeeded)
                {
                    return Ok(
                        new
                        {
                            Success = true,
                            Message = "Ticket has been created"
                        }
                    );
                }
                return BadRequest(result.Errors);

            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateTicket(int id,

         [FromBody] Ticket newTicket)
        {
            try
            {
                var result = await _ticketService.UpdateTicketAsync(id, newTicket);
                if (result.Succeeded)
                {
                    return Ok(new
                    {
                        Success = true,
                        Message = "Ticket has been updated"
                    });
                }
                return BadRequest(result.Errors);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            try
            {
                var result = await _ticketService.DeleteTicketAsync(id);
                if (result.Succeeded)
                {
                    return Ok(new
                    {
                        Success = true,
                        Message = "Ticket has been deleted"
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
