using PomodoroApi.Models;

namespace PomodoroApi.Data.Repositories;

public interface ITaskRepository
{
    Task<List<TaskItem>> GetByUserIdAsync(Guid userId);
    Task<TaskItem?> GetByIdAsync(Guid id, Guid userId);
    Task<bool> ExistsAsync(Guid id, Guid userId);
    Task<TaskItem> CreateAsync(TaskItem task);
    Task<TaskItem> UpdateAsync(TaskItem task);
    Task DeleteAsync(TaskItem task);
    Task DeleteCompletedAsync(Guid userId);
}
