using database;
using database.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models;
using Sprache;

namespace Services
{
    public class TicketService
    {
        private readonly UserManager<User> _userManager;

        private readonly ApplicationDbContext _context;

        public TicketService(UserManager<User> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public async Task<Ticket?> GetTicketByIdAsync(int ticketId)
        {
            return await _context.Tickets.Where(t => t.Id == ticketId).Include(t => t.Parts).Include(t => t.TimeSlots).FirstOrDefaultAsync();
        }

        public async Task<List<Ticket>> GetTicketsByUserIdAsync(string userId)
        {
            return await _context.Tickets.Where(t => t.UserId == userId).ToListAsync();
        }

        public async Task<List<Ticket>> GetAllTicketsAsync()
        {
            return await _context.Tickets.ToListAsync();
        }

        public async Task<IdentityResult> CreateTicketAsync(TicketModel ticketModel, string userId)
        {
            Console.WriteLine("Creating ticket");
            if (userId == null)
            {
                throw new CustomBadRequest("User not found");
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new CustomBadRequest("User not found");
            }
            if (ticketModel.Brand == "" || ticketModel.Model == "" || ticketModel.RegistrationId == "" || ticketModel.Description == "")
            {
                throw new CustomBadRequest("Missing required fields");
            }
            var ticket = new Ticket
            {
                Brand = ticketModel.Brand,
                Model = ticketModel.Model,
                RegistrationId = ticketModel.RegistrationId,
                Description = ticketModel.Description,
                UserId = userId
            };
            _context.Tickets.Add(ticket);
            return await _context.SaveChangesAsync() > 0 ? IdentityResult.Success : IdentityResult.Failed();
        }

        public async Task<IdentityResult> UpdateTicketAsync(int ticketId, Ticket newTicket)
        {
            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == ticketId);
            if (ticket != null)
            {
                ticket.Description = newTicket.Description;
                ticket.Status = newTicket.Status;
                ticket.UserId = newTicket.UserId;
                return await _userManager.UpdateAsync(ticket.User);
            }
            return IdentityResult.Failed();
        }

        public async Task<IdentityResult> DeleteTicketAsync(int ticketId)
        {
            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == ticketId);
            if (ticket != null)
            {
                _context.Tickets.Remove(ticket);
                if (ticket.Parts != null && ticket.Parts.Count > 0)
                    _context.Parts.RemoveRange(ticket.Parts);
                if (ticket.TimeSlots != null && ticket.TimeSlots.Count > 0)
                    _context.TimeSlots.RemoveRange(ticket.TimeSlots);
                return await _context.SaveChangesAsync() > 0 ? IdentityResult.Success : IdentityResult.Failed();
            }
            return IdentityResult.Failed();
        }

    }
}
