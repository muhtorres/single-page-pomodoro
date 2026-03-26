using PomodoroApi.Models;

namespace PomodoroApi.Data.Repositories;

public interface ISessionRepository
{
    Task<PomodoroSession> CreateAsync(PomodoroSession session);
}
