using database;
using database.Models;
using Microsoft.AspNetCore.Identity;

namespace Services
{
    public class TimeSlotService
    {
        private readonly UserManager<User> _userManager;

        private readonly TicketService _ticketService;

        private readonly ApplicationDbContext _context;

        public TimeSlotService(UserManager<User> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }
    }

    
}
