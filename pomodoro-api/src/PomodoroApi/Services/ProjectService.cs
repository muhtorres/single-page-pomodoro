using PomodoroApi.Data.Repositories;
using PomodoroApi.DTOs;
using PomodoroApi.Models;

namespace PomodoroApi.Services;

public class ProjectService(IProjectRepository projectRepository) : IProjectService
{
    public Task<List<Project>> GetProjectsAsync(Guid userId) =>
        projectRepository.GetByUserIdAsync(userId);

    public async Task<Project> CreateProjectAsync(Guid userId, CreateProjectRequest request)
    {
        var project = new Project
        {
            UserId = userId,
            Name = request.Name.Trim(),
            Color = request.Color ?? "#3B82F6",
            IsDefault = false,
        };

        return await projectRepository.CreateAsync(project);
    }

    public async Task<Project?> UpdateProjectAsync(Guid userId, Guid id, UpdateProjectRequest request)
    {
        var project = await projectRepository.GetByIdAsync(id, userId);
        if (project is null) return null;

        if (request.Name is not null) project.Name = request.Name.Trim();
        if (request.Color is not null) project.Color = request.Color;
        project.UpdatedAt = DateTime.UtcNow;

        return await projectRepository.UpdateAsync(project);
    }

    public async Task<DeleteProjectResult> DeleteProjectAsync(Guid userId, Guid id)
    {
        var project = await projectRepository.GetByIdAsync(id, userId);
        if (project is null) return DeleteProjectResult.NotFound;
        if (project.IsDefault) return DeleteProjectResult.IsDefault;

        var defaultProject = await projectRepository.GetDefaultByUserIdAsync(userId);
        if (defaultProject is not null)
            await projectRepository.ReassignTasksAsync(id, defaultProject.Id);

        await projectRepository.DeleteAsync(project);
        return DeleteProjectResult.Success;
    }
}
