namespace Models
{
    public class LoginModel
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class RegisterModel
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class UpdateNameModel
    {
        public string NewName { get; set; } = "";
    }

    public class ChangePasswordModel
    {
        public string CurrentPassword { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }

}