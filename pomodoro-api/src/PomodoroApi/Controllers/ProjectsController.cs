using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PomodoroApi.DTOs;
using PomodoroApi.Models;
using PomodoroApi.Services;

namespace PomodoroApi.Controllers;

[ApiController]
[Route("api/projects")]
[Authorize]
public class ProjectsController(IProjectService projectService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ProjectResponse>>> GetProjects()
    {
        var projects = await projectService.GetProjectsAsync(GetCurrentUserId());
        return Ok(projects.Select(ToResponse).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<ProjectResponse>> CreateProject([FromBody] CreateProjectRequest request)
    {
        var project = await projectService.CreateProjectAsync(GetCurrentUserId(), request);
        return CreatedAtAction(nameof(GetProjects), ToResponse(project));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProjectResponse>> UpdateProject(Guid id, [FromBody] UpdateProjectRequest request)
    {
        var project = await projectService.UpdateProjectAsync(GetCurrentUserId(), id, request);
        if (project is null) return NotFound();
        return Ok(ToResponse(project));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        var result = await projectService.DeleteProjectAsync(GetCurrentUserId(), id);
        return result switch
        {
            DeleteProjectResult.NotFound => NotFound(),
            DeleteProjectResult.IsDefault => BadRequest("Cannot delete the default project."),
            _ => NoContent(),
        };
    }

    private Guid GetCurrentUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
               ?? User.FindFirstValue("sub")
               ?? throw new UnauthorizedAccessException();
        return Guid.Parse(sub);
    }

    private static ProjectResponse ToResponse(Project p) => new(
        p.Id, p.Name, p.Color, p.IsDefault, p.CreatedAt, p.UpdatedAt
    );
}
