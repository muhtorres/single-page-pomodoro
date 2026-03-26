using PomodoroApi.Models;

namespace PomodoroApi.Data.Repositories;

public class SessionRepository(AppDbContext db) : ISessionRepository
{
    public async Task<PomodoroSession> CreateAsync(PomodoroSession session)
    {
        db.Sessions.Add(session);
        await db.SaveChangesAsync();
        return session;
    }
}
