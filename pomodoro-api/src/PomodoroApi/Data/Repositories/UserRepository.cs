using Microsoft.EntityFrameworkCore;
using PomodoroApi.Models;

namespace PomodoroApi.Data.Repositories;

public class UserRepository(AppDbContext db) : IUserRepository
{
    public Task<User?> FindByIdAsync(Guid id) =>
        db.Users.FindAsync(id).AsTask();

    public Task<User?> FindByProviderAsync(string provider, string providerId) =>
        db.Users.FirstOrDefaultAsync(u => u.Provider == provider && u.ProviderId == providerId);

    public async Task<User> CreateAsync(User user)
    {
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateAsync(User user)
    {
        await db.SaveChangesAsync();
        return user;
    }
}
