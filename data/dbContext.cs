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
                .HasMany(u => u.Tickets)
                .WithOne(t => t.User)
                .HasForeignKey(t => t.UserId);

            builder.Entity<Ticket>()
                .HasMany(t => t.TimeSlots)
                .WithOne(ts => ts.Ticket)
                .HasForeignKey(ts => ts.TicketId);

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