using database.Models;
using Microsoft.AspNetCore.Identity;
using Models;
using Sprache;
using System.Threading.Tasks;

namespace Services
{
    public class UserService
    {
        private readonly UserManager<User> _userManager;

        public UserService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId);
        }

        public async Task<IdentityResult> UpdateUserNameAsync(string userId, string newName)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                user.UserName = newName;
                return await _userManager.UpdateAsync(user);
            }
            return IdentityResult.Failed();
        }

        public async Task<IdentityResult> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user != null)
            {
                var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
                if (result.Succeeded)
                {
                    return IdentityResult.Success;
                }
                else if (result.Errors.Any())
                {
                    throw new CustomBadRequest(result.Errors.First().Description);
                }
            }
            return IdentityResult.Failed();

        }

        public async Task<IdentityResult> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                return await _userManager.DeleteAsync(user);
            }
            return IdentityResult.Failed();
        }

        public async Task<IList<User>> GetAllEmployeesAsync()
        {
            return await _userManager.GetUsersInRoleAsync("Worker");
        }
    }
}
