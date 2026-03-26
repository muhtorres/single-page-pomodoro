using PomodoroApi.DTOs;
using PomodoroApi.Models;

namespace PomodoroApi.Services;

public enum DeleteProjectResult { Success, NotFound, IsDefault }

public interface IProjectService
{
    Task<List<Project>> GetProjectsAsync(Guid userId);
    Task<Project> CreateProjectAsync(Guid userId, CreateProjectRequest request);
    Task<Project?> UpdateProjectAsync(Guid userId, Guid id, UpdateProjectRequest request);
    Task<DeleteProjectResult> DeleteProjectAsync(Guid userId, Guid id);
}
