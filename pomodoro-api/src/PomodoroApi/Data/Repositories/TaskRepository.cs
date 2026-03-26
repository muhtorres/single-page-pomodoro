using Microsoft.EntityFrameworkCore;
using PomodoroApi.Models;

namespace PomodoroApi.Data.Repositories;

public class TaskRepository(AppDbContext db) : ITaskRepository
{
    public Task<List<TaskItem>> GetByUserIdAsync(Guid userId) =>
        db.Tasks
            .Where(t => t.UserId == userId)
            .OrderBy(t => t.CreatedAt)
            .ToListAsync();

    public Task<TaskItem?> GetByIdAsync(Guid id, Guid userId) =>
        db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

    public Task<bool> ExistsAsync(Guid id, Guid userId) =>
        db.Tasks.AnyAsync(t => t.Id == id && t.UserId == userId);

    public async Task<TaskItem> CreateAsync(TaskItem task)
    {
        db.Tasks.Add(task);
        await db.SaveChangesAsync();
        return task;
    }

    public async Task<TaskItem> UpdateAsync(TaskItem task)
    {
        await db.SaveChangesAsync();
        return task;
    }

    public async Task DeleteAsync(TaskItem task)
    {
        db.Tasks.Remove(task);
        await db.SaveChangesAsync();
    }

    public Task DeleteCompletedAsync(Guid userId) =>
        db.Tasks
            .Where(t => t.UserId == userId && t.IsCompleted)
            .ExecuteDeleteAsync();
}
