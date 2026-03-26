using PomodoroApi.Models;

namespace PomodoroApi.Data.Repositories;

public interface IUserRepository
{
    Task<User?> FindByIdAsync(Guid id);
    Task<User?> FindByProviderAsync(string provider, string providerId);
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
}
