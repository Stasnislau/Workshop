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

        public async Task<IdentityResult> AddTimeSlotAsync(TimeSlotModel timeSlotModel, int ticketId,string userId)
        {
            if (timeSlotModel.StartTime == null || timeSlotModel.EndTime == null || timeSlotModel.StartTime == "" || timeSlotModel.EndTime == "" || ticketId == 0 || userId == "")
            {
                throw new CustomBadRequest("Missing required fields");
            }
            var timeSlot = new TimeSlot
            {
                StartTime = DateTime.Parse(timeSlotModel.EndTime).ToUniversalTime(),
                EndTime = DateTime.Parse(timeSlotModel.EndTime).ToUniversalTime(),
                TicketId = ticketId,
                UserId = userId
            };
            _context.TimeSlots.Add(timeSlot);
            bool Succeeded = await _context.SaveChangesAsync() > 0;
            if (Succeeded)
            {
                return await _ticketService.RecalculateTotalPrice(ticketId) ? IdentityResult.Success : IdentityResult.Failed();
            }
            throw new CustomBadRequest("Failed to add time slot");
        }

        public async Task<IdentityResult> UpdateTimeSlotAsync(TimeSlotModel timeSlotModel, int timeSlotId)
        {
            var timeSlot = await _context.TimeSlots.Where(ts => ts.Id == timeSlotId).FirstOrDefaultAsync();
            if (timeSlot != null)
            {
                timeSlot.StartTime = DateTime.Parse(timeSlotModel.EndTime).ToUniversalTime();
                timeSlot.EndTime = DateTime.Parse(timeSlotModel.EndTime).ToUniversalTime();
                bool Succeeded = await _context.SaveChangesAsync() > 0;
                if (Succeeded)
                {
                    return await _ticketService.RecalculateTotalPrice(timeSlot.TicketId) ? IdentityResult.Success : IdentityResult.Failed();
                }
            }
            throw new CustomBadRequest("Failed to update time slot");
        }

        public async Task<IdentityResult> DeleteTimeSlotAsync(int timeSlotId)
        {
            var timeSlot = await _context.TimeSlots.Where(ts => ts.Id == timeSlotId).FirstOrDefaultAsync();
            if (timeSlot != null)
            {
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
