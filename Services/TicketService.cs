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
            var ticket = await _context.Tickets.Where(t => t.Id == ticketId).FirstOrDefaultAsync();
            if (ticket != null)
            {
                ticket.Parts = await _context.Parts.Where(p => p.TicketId == ticketId).ToListAsync();
                ticket.TimeSlots = await _context.TimeSlots.Where(ts => ts.TicketId == ticketId).ToListAsync();
            }
            return ticket;
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
                _context.Tickets.Update(ticket).CurrentValues.SetValues(new
                {
                    Brand = newTicket.Brand,
                    Model = newTicket.Model,
                    RegistrationId = newTicket.RegistrationId,
                    Description = newTicket.Description,
                    Status = newTicket.Status
                }
                );

                var result = await _context.SaveChangesAsync() > 0 ? IdentityResult.Success : IdentityResult.Failed();
                if (!result.Succeeded)
                {
                    throw new CustomBadRequest("Failed to update ticket");
                }
                return RecalculateTotalPrice(ticketId).Result ? IdentityResult.Success : IdentityResult.Failed();

            }

            throw new CustomBadRequest("Ticket not found");
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
            throw new CustomBadRequest("Ticket not found");
        }

        public async Task<bool> RecalculateTotalPrice(int ticketId)
        {
            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == ticketId);
            var parts = await _context.Parts.Where(p => p.TicketId == ticketId).ToListAsync();
            var timeSlots = await _context.TimeSlots.Where(ts => ts.TicketId == ticketId).ToListAsync();
            if (ticket != null)
            {
                decimal totalPrice = 0;
                if (parts != null && parts.Count > 0)
                {
                    foreach (var part in parts)
                    {
                        totalPrice += part.TotalPrice;
                    }
                }
                if (timeSlots != null && timeSlots.Count > 0)
                {
                    foreach (var timeSlot in timeSlots)
                    {
                        var employee = await _userManager.FindByIdAsync(timeSlot.UserId);
                        if (employee != null)
                        {
                            totalPrice += employee.HourlyRate * (timeSlot.EndTime - timeSlot.StartTime).Hours;
                        }
                    }
                }
                ticket.TotalPrice = totalPrice;
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
