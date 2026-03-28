using PomodoroApi.Data.Repositories;
using PomodoroApi.DTOs;
using PomodoroApi.Models;

namespace PomodoroApi.Services;

public class TaskService(ITaskRepository taskRepository, IProjectRepository projectRepository) : ITaskService
{
    public Task<List<TaskItem>> GetTasksAsync(Guid userId) =>
        taskRepository.GetByUserIdAsync(userId);

    public async Task<TaskItem> CreateTaskAsync(Guid userId, CreateTaskRequest request)
    {
        var projectId = request.ProjectId;

        if (projectId is null)
        {
            var defaultProject = await projectRepository.GetDefaultByUserIdAsync(userId);
            projectId = defaultProject?.Id;
        }

        var task = new TaskItem
        {
            UserId = userId,
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            EstimatedPomodoros = Math.Clamp(request.EstimatedPomodoros, 1, 20),
            ProjectId = projectId,
        };

        return await taskRepository.CreateAsync(task);
    }

    public async Task<TaskItem?> UpdateTaskAsync(Guid userId, Guid id, UpdateTaskRequest request)
    {
        var task = await taskRepository.GetByIdAsync(id, userId);
        if (task is null) return null;

        if (request.Title is not null) task.Title = request.Title.Trim();
        if (request.Description is not null) task.Description = request.Description.Trim();
        if (request.EstimatedPomodoros.HasValue) task.EstimatedPomodoros = Math.Clamp(request.EstimatedPomodoros.Value, 1, 20);
        if (request.ActualPomodoros.HasValue) task.ActualPomodoros = Math.Max(0, request.ActualPomodoros.Value);
        if (request.IsCompleted.HasValue)
        {
            task.IsCompleted = request.IsCompleted.Value;
            task.CompletedAt = request.IsCompleted.Value ? DateTime.UtcNow : null;
        }
        if (request.CompletedAt.HasValue) task.CompletedAt = request.CompletedAt.Value;
        if (request.ProjectId.HasValue) task.ProjectId = request.ProjectId.Value;
        task.UpdatedAt = DateTime.UtcNow;

        return await taskRepository.UpdateAsync(task);
    }

    public async Task<bool> DeleteTaskAsync(Guid userId, Guid id)
    {
        var task = await taskRepository.GetByIdAsync(id, userId);
        if (task is null) return false;

        await taskRepository.DeleteAsync(task);
        return true;
    }

    public Task ClearCompletedAsync(Guid userId) =>
        taskRepository.DeleteCompletedAsync(userId);
}
