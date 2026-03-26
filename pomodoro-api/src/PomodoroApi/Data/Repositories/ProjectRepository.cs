using Microsoft.EntityFrameworkCore;
using PomodoroApi.Models;

namespace PomodoroApi.Data.Repositories;

public class ProjectRepository(AppDbContext db) : IProjectRepository
{
    public Task<List<Project>> GetByUserIdAsync(Guid userId) =>
        db.Projects
            .Where(p => p.UserId == userId)
            .OrderBy(p => p.CreatedAt)
            .ToListAsync();

    public Task<Project?> GetByIdAsync(Guid id, Guid userId) =>
        db.Projects.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

    public Task<Project?> GetDefaultByUserIdAsync(Guid userId) =>
        db.Projects.FirstOrDefaultAsync(p => p.UserId == userId && p.IsDefault);

    public async Task<Project> CreateAsync(Project project)
    {
        db.Projects.Add(project);
        await db.SaveChangesAsync();
        return project;
    }

    public async Task<Project> UpdateAsync(Project project)
    {
        await db.SaveChangesAsync();
        return project;
    }

    public async Task DeleteAsync(Project project)
    {
        db.Projects.Remove(project);
        await db.SaveChangesAsync();
    }

    public Task ReassignTasksAsync(Guid fromProjectId, Guid toProjectId) =>
        db.Tasks
            .Where(t => t.ProjectId == fromProjectId)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.ProjectId, toProjectId));
}
