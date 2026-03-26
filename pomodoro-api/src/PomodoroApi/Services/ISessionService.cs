using PomodoroApi.DTOs;
using PomodoroApi.Models;

namespace PomodoroApi.Services;

public interface ISessionService
{
    Task<(PomodoroSession? Session, string? Error)> CreateSessionAsync(Guid userId, CreateSessionRequest request);
}
