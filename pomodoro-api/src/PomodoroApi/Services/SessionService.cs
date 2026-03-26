using PomodoroApi.Data.Repositories;
using PomodoroApi.DTOs;
using PomodoroApi.Models;

namespace PomodoroApi.Services;

public class SessionService(ISessionRepository sessionRepository, ITaskRepository taskRepository) : ISessionService
{
    public async Task<(PomodoroSession? Session, string? Error)> CreateSessionAsync(Guid userId, CreateSessionRequest request)
    {
        if (request.TaskId.HasValue)
        {
            var taskExists = await taskRepository.ExistsAsync(request.TaskId.Value, userId);
            if (!taskExists)
                return (null, "Task not found or does not belong to this user.");
        }

        var session = new PomodoroSession
        {
            UserId = userId,
            TaskId = request.TaskId,
            Mode = request.Mode,
            DurationMinutes = request.DurationMinutes,
            WasCompleted = request.WasCompleted,
        };

        var created = await sessionRepository.CreateAsync(session);
        return (created, null);
    }
}
