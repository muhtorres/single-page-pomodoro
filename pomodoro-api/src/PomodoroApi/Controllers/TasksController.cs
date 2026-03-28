using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PomodoroApi.DTOs;
using PomodoroApi.Models;
using PomodoroApi.Services;

namespace PomodoroApi.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize]
public class TasksController(ITaskService taskService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<TaskResponse>>> GetTasks()
    {
        var tasks = await taskService.GetTasksAsync(GetCurrentUserId());
        return Ok(tasks.Select(ToResponse).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<TaskResponse>> CreateTask([FromBody] CreateTaskRequest request)
    {
        var task = await taskService.CreateTaskAsync(GetCurrentUserId(), request);
        return CreatedAtAction(nameof(GetTasks), ToResponse(task));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TaskResponse>> UpdateTask(Guid id, [FromBody] UpdateTaskRequest request)
    {
        var task = await taskService.UpdateTaskAsync(GetCurrentUserId(), id, request);
        if (task is null) return NotFound();
        return Ok(ToResponse(task));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        var deleted = await taskService.DeleteTaskAsync(GetCurrentUserId(), id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    [HttpDelete("completed")]
    public async Task<IActionResult> ClearCompleted()
    {
        await taskService.ClearCompletedAsync(GetCurrentUserId());
        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
               ?? User.FindFirstValue("sub")
               ?? throw new UnauthorizedAccessException();
        return Guid.Parse(sub);
    }

    private static TaskResponse ToResponse(TaskItem t) => new(
        t.Id, t.Title, t.Description, t.IsCompleted, t.CompletedAt, t.EstimatedPomodoros, t.ActualPomodoros, t.CreatedAt, t.UpdatedAt, t.ProjectId
    );
}
