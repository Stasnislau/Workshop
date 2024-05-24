using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;

namespace database.Models
{
    public class User : IdentityUser
    {
        public string Name { get; set; } = "";

        public decimal HourlyRate { get; set; } = 10;

        public string RefreshToken { get; set; } = "";
        public DateTime RefreshTokenExpiryTime { get; set; }

        public List<Ticket> Tickets { get; set; } = new List<Ticket>();

        public List<TimeSlot> TimeSlots { get; set; } = new List<TimeSlot>();

    }

    public class Ticket
    {
        public int Id { get; set; }
        public string Brand { get; set; } = "";

        public string Model { get; set; } = "";

        public string RegistrationId { get; set; } = "";

        public string Description { get; set; } = "";

        public decimal TotalPrice { get; set; } = 0;

        public string Status { get; set; } = "Created";


        public string UserId { get; set; } = "";

        public User User { get; set; } = null!;


        public List<TimeSlot> TimeSlots { get; set; } = null!;

        public List<Part> Parts { get; set; } = new List<Part>();



    }

    public class TimeSlot
    {
        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public int Id { get; set; }

        public string UserId { get; set; } = "";

        public User User { get; set; } = null!;

        public int TicketId { get; set; }

        public Ticket Ticket { get; set; } = null!;
    }

    public class Part
    {
        public int Id { get; set; }

        public string Name { get; set; } = "";

        public decimal Price { get; set; } = 0;

        public decimal Quantity { get; set; } = 0;

        public decimal TotalPrice { get; set; } = 0;

        public int TicketId { get; set; }

        public Ticket Ticket { get; set; } = null!;
    }



}