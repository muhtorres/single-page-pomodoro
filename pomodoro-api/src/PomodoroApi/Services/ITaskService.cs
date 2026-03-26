using PomodoroApi.DTOs;
using PomodoroApi.Models;

namespace PomodoroApi.Services;

public interface ITaskService
{
    Task<List<TaskItem>> GetTasksAsync(Guid userId);
    Task<TaskItem> CreateTaskAsync(Guid userId, CreateTaskRequest request);
    Task<TaskItem?> UpdateTaskAsync(Guid userId, Guid id, UpdateTaskRequest request);
    Task<bool> DeleteTaskAsync(Guid userId, Guid id);
    Task ClearCompletedAsync(Guid userId);
}
