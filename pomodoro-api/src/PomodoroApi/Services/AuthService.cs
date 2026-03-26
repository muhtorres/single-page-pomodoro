using PomodoroApi.Data.Repositories;
using PomodoroApi.Models;

namespace PomodoroApi.Services;

public class AuthService(IUserRepository userRepository, IProjectRepository projectRepository) : IAuthService
{
    public Task<User?> GetUserByIdAsync(Guid id) =>
        userRepository.FindByIdAsync(id);

    public async Task<User> FindOrCreateUserAsync(string provider, string providerId, string name, string email, string? avatarUrl)
    {
        var user = await userRepository.FindByProviderAsync(provider, providerId);

        if (user is null)
        {
            user = new User
            {
                Provider = provider,
                ProviderId = providerId,
                Email = email,
                Name = name,
                AvatarUrl = avatarUrl,
            };
            await userRepository.CreateAsync(user);

            var defaultProject = new Project
            {
                UserId = user.Id,
                Name = "Default",
                Color = "#3B82F6",
                IsDefault = true,
            };
            await projectRepository.CreateAsync(defaultProject);
        }
        else
        {
            user.Name = name;
            user.Email = email;
            user.AvatarUrl = avatarUrl;
            await userRepository.UpdateAsync(user);
        }

        return user;
    }
}
