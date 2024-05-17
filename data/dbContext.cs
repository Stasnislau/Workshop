using database.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace database
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }


        public DbSet<Ticket> Tickets { get; set; } = null!;
        public DbSet<TimeSlot> TimeSlots { get; set; } = null!;

        public DbSet<Part> Parts { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


            builder.Entity<User>()
                .HasOne(u => u.Ticket)
                .WithOne(t => t.User)
                .HasForeignKey<Ticket>(t => t.UserId);

            builder.Entity<Ticket>()
                .HasOne(t => t.TimeSlot)
                .WithOne(ts => ts.Ticket)
                .HasForeignKey<TimeSlot>(ts => ts.TicketId);

            builder.Entity<TimeSlot>()
                .HasOne(ts => ts.User)
                .WithMany(u => u.TimeSlots)
                .HasForeignKey(ts => ts.UserId);

            builder.Entity<Part>()
                .HasOne(p => p.Ticket)
                .WithMany(t => t.Parts)
                .HasForeignKey(p => p.TicketId);

        }
    }


}