using PomodoroApi.Models;

namespace PomodoroApi.Services;

public interface IAuthService
{
    Task<User?> GetUserByIdAsync(Guid id);
    Task<User> FindOrCreateUserAsync(string provider, string providerId, string name, string email, string? avatarUrl);
}
