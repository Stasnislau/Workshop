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
            return await _context.Tickets.Where(t => t.Users.Any(u => u.Id == userId)).Include(t => t.Parts).Include(t => t.TimeSlots.Where(ts => ts.UserId == userId)
            ).ToListAsync();
        }

        public async Task<List<Ticket>> GetAllTicketsAsync()
        {
            return await _context.Tickets.ToListAsync();
        }

        public async Task<IdentityResult> CreateTicketAsync(TicketModel ticketModel, string userId)
        {
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
                ticket.Model = newTicket.Model;
                ticket.Brand = newTicket.Brand;
                ticket.RegistrationId = newTicket.RegistrationId;
                ticket.Status = newTicket.Status;
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

        public async Task<bool> RecalculateTotalPrice(int ticketId)
        {
            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == ticketId);
            if (ticket != null)
            {
                ticket.TotalPrice = 0;
                foreach (var part in ticket.Parts)
                {
                    ticket.TotalPrice += part.TotalPrice;
                }
                foreach (var timeSlot in ticket.TimeSlots)
                {
                    var employee = await _userManager.FindByIdAsync(timeSlot.UserId);
                    if (employee != null)
                    {
                        ticket.TotalPrice += employee.HourlyRate * (timeSlot.EndTime - timeSlot.StartTime).Hours;
                    }
                }
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
