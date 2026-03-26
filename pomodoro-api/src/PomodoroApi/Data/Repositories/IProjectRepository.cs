using PomodoroApi.Models;

namespace PomodoroApi.Data.Repositories;

public interface IProjectRepository
{
    Task<List<Project>> GetByUserIdAsync(Guid userId);
    Task<Project?> GetByIdAsync(Guid id, Guid userId);
    Task<Project?> GetDefaultByUserIdAsync(Guid userId);
    Task<Project> CreateAsync(Project project);
    Task<Project> UpdateAsync(Project project);
    Task DeleteAsync(Project project);
    Task ReassignTasksAsync(Guid fromProjectId, Guid toProjectId);
}
