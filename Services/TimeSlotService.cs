using System.Security.Claims;
using database;
using database.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services
{
    public class TimeSlotService
    {
        private readonly UserManager<User> _userManager;

        private readonly TicketService _ticketService;

        private readonly ApplicationDbContext _context;

        public TimeSlotService(UserManager<User> userManager, ApplicationDbContext context, TicketService ticketService)
        {
            _userManager = userManager;
            _context = context;
            _ticketService = ticketService;
        }

        public async Task<TimeSlot?> GetTimeSlotByIdAsync(int timeSlotId)
        {
            return await _context.TimeSlots.Where(ts => ts.Id == timeSlotId).FirstOrDefaultAsync();
        }

        public async Task<List<TimeSlot>> GetAllTimeSlotsAsync(string userId)
        {
            return await _context.TimeSlots.Where(ts => ts.UserId == userId).ToListAsync();
        }

        public async Task<IdentityResult> AddTimeSlotAsync(TimeSlotModel timeSlotModel, int ticketId, string userId)
        {
            if (timeSlotModel.StartTime == null || timeSlotModel.EndTime == null || timeSlotModel.StartTime == "" || timeSlotModel.EndTime == "" || ticketId == 0 || userId == "")
            {
                throw new CustomBadRequest("Missing required fields");
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new CustomBadRequest("User not found");
            }
            var userTimeSlots = await _context.TimeSlots.Where(ts => ts.UserId == userId).ToListAsync();
            var userTickets = await _context.Tickets.Where(t => t.Users.Any(u => u.Id == userId)).ToListAsync();
            foreach (var ts in userTimeSlots)
            {
                if (DateTime.Parse(timeSlotModel.StartTime).ToUniversalTime() >= ts.StartTime && DateTime.Parse(timeSlotModel.StartTime).ToUniversalTime() <= ts.EndTime)
                {
                    throw new CustomBadRequest("Time slot overlaps with another time slot");
                }
                if (DateTime.Parse(timeSlotModel.EndTime).ToUniversalTime() >= ts.StartTime && DateTime.Parse(timeSlotModel.EndTime).ToUniversalTime() <= ts.EndTime)
                {
                    throw new CustomBadRequest("Time slot overlaps with another time slot");
                }
            }
            var timeSlot = new TimeSlot
            {
                StartTime = DateTime.Parse(timeSlotModel.StartTime).ToUniversalTime(),
                EndTime = DateTime.Parse(timeSlotModel.EndTime).ToUniversalTime(),
                TicketId = ticketId,
                UserId = userId
            };
            if (userTickets.Any(t => t.Id == ticketId) == false)
            {
                var ticket = await _context.Tickets.Where(t => t.Id == ticketId).FirstOrDefaultAsync();
                _context.Tickets.Find(ticketId)!.Users.Add(user);
            }
            _context.TimeSlots.Add(timeSlot);
            var ticketUser = await _context.Tickets.Where(t => t.Id == ticketId).Include(t => t.Users).FirstOrDefaultAsync();
            bool Succeeded = await _context.SaveChangesAsync() > 0;
            if (Succeeded)
            {
                return await _ticketService.RecalculateTotalPrice(ticketId) ? IdentityResult.Success : IdentityResult.Failed();
            }
            throw new CustomBadRequest("Failed to add time slot");
        }

        public async Task<IdentityResult> DeleteTimeSlotAsync(int timeSlotId)
        {
            var timeSlot = await _context.TimeSlots.Where(ts => ts.Id == timeSlotId).FirstOrDefaultAsync();

            if (timeSlot != null)
            {
                var userId = timeSlot.UserId;
                var ticket  = await _context.Tickets.Where(t => t.Id == timeSlot.TicketId).Include(t => t.Users).FirstOrDefaultAsync();
                var employeeTimeSlotsForThisTicket = await _context.TimeSlots.Where(ts => ts.UserId == userId && ts.TicketId == timeSlot.TicketId).ToListAsync();
                if (employeeTimeSlotsForThisTicket.Count == 1)
                {
                    ticket.Users.Remove(await _context.Users.Where(u => u.Id == userId).FirstOrDefaultAsync());
                }
                _context.TimeSlots.Remove(timeSlot);
                bool Succeeded = await _context.SaveChangesAsync() > 0;
                if (Succeeded)
                {
                    return await _ticketService.RecalculateTotalPrice(timeSlot.TicketId) ? IdentityResult.Success : IdentityResult.Failed();
                }
            }
            throw new CustomBadRequest("Failed to delete time slot");
        }
    }


}
