using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class LoginModel
    {
        [Required]
        public string Username { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";
    }

    public class RegisterModel
    {
        [Required]
        public string Username { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";
    }

    public class TicketModel
    {
        [Required]
        public string Brand { get; set; } = "";
        [Required]
        public string Model { get; set; } = "";
        [Required]
        public string RegistrationId { get; set; } = "";
        [Required]
        public string Description { get; set; } = "";

        [Required]
        public string UserId { get; set; } = "";
    }

    public class ChangePasswordModel
    {
        [Required]
        public string CurrentPassword { get; set; } = "";
        [Required]
        public string NewPassword { get; set; } = "";
    }

}