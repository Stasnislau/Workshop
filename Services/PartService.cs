using database;
using database.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services
{
    public class PartService
    {
        private readonly UserManager<User> _userManager;

        private readonly TicketService _ticketService;

        private readonly ApplicationDbContext _context;

        public PartService(UserManager<User> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _ticketService = new TicketService(userManager, context);
            _context = context;
        }

        public async Task<Part?> GetPartByIdAsync(int partId)
        {
            return await _context.Parts.Where(p => p.Id == partId).FirstOrDefaultAsync();
        }

        public async Task<List<Part>> GetAllPartsAsync(int ticketId)
        {
            return await _context.Parts.Where(p => p.TicketId == ticketId).ToListAsync();
        }

        public async Task<IdentityResult> AddPartAsync(PartModel partModel, int ticketId)
        {
            if (partModel.Name == "" || partModel.Price == 0)
            {
                throw new CustomBadRequest("Missing required fields");
            }
            var part = new Part
            {
                Name = partModel.Name,
                Price = partModel.Price,
                Quantity = partModel.Quantity,
                TotalPrice = partModel.Price * partModel.Quantity,
                TicketId = ticketId,
            };
            _context.Parts.Add(part);
            bool Succeeded = await _context.SaveChangesAsync() > 0;
            if (Succeeded)
            {
                return await _ticketService.RecalculateTotalPrice(ticketId) ? IdentityResult.Success : IdentityResult.Failed();
            }
            throw new CustomBadRequest("Failed to add part");
        }

        public async Task<IdentityResult> UpdatePartAsync(PartModel partModel, int partId)
        {
            var part = await _context.Parts.Where(p => p.Id == partId).FirstOrDefaultAsync();
            if (part != null)
            {
                part.Name = partModel.Name;
                part.Price = partModel.Price;
                part.Quantity = partModel.Quantity;
                part.TotalPrice = partModel.Price * partModel.Quantity;
                bool Succeeded = await _context.SaveChangesAsync() > 0;
                if (Succeeded)
                {
                    return await _ticketService.RecalculateTotalPrice(part.TicketId) ? IdentityResult.Success : IdentityResult.Failed();
                }
            }
            throw new CustomBadRequest("Failed to update part");
        }

        public async Task<IdentityResult> DeletePartAsync(int partId)
        {
            var part = await _context.Parts.Where(p => p.Id == partId).FirstOrDefaultAsync();
            if (part == null)
            {
                throw new CustomBadRequest("Part not found");
            }
            int ticketId = part.TicketId;
            _context.Parts.Remove(part);

            bool Succeeded = await _context.SaveChangesAsync() > 0;

            if (Succeeded)
            {
                return await _ticketService.RecalculateTotalPrice(ticketId) ? IdentityResult.Success : IdentityResult.Failed();
            }

            throw new CustomBadRequest("Failed to delete part");
        }

    }
}
