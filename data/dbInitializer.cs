using System.Linq;
using System.Threading.Tasks;
using database;
using database.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

public class DbInitializer
{
    public static async Task InitializeAsync(IServiceScope serviceScope)
    {
        var roleManager = serviceScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var context = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        if (!context.Roles.Any())
        {
            await SeedRoles(roleManager);
        }

        if (!context.Users.Any())
        {
            await SeedUsers(userManager, roleManager);
        }
    }

    public static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
    {
        var roles = new[]
        {
            new IdentityRole("Admin"),
            new IdentityRole("Worker"),
        };

        foreach (var role in roles)
        {
            await roleManager.CreateAsync(role);
        }
    }

    public static async Task SeedUsers(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        var users = new[]
        {
            new User
            {
                UserName = "admin",
            },
            new User
            {
                UserName = "rab1",
            },
            new User
            {
                UserName = "rab2",
            },
            new User
            {
                UserName = "rab3",
            },
        };

        foreach (var user in users)
        {
            var existingUser = await userManager.FindByNameAsync(user.UserName);
            if (existingUser == null)
            {
                var createUserResult = await userManager.CreateAsync(user, "123ZaZ!");
                if (createUserResult.Succeeded)
                {
                    if (user.UserName == "admin")
                    {
                        await AssignAdminRole(userManager, roleManager);
                    }
                }
            }
        }
    }

    private static async Task AssignAdminRole(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        var adminRole = await roleManager.FindByNameAsync("Admin");
        var adminUser = await userManager.FindByNameAsync("admin");
       

        if (adminUser != null && adminRole != null && !await userManager.IsInRoleAsync(adminUser, adminRole.Name))
        {
            await userManager.AddToRoleAsync(adminUser, adminRole.Name);
        }
    }

    private static async Task AssignWorkerRole(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, string username)
    {
        var workerRole = await roleManager.FindByNameAsync("Worker");
        var workerUser = await userManager.FindByNameAsync(username);

        if (workerUser != null && workerRole != null && !await userManager.IsInRoleAsync(workerUser, workerRole.Name))
        {
            await userManager.AddToRoleAsync(workerUser, workerRole.Name);
        }
    }
}