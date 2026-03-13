using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PomodoroApi.Data;
using PomodoroApi.DTOs;
using PomodoroApi.Models;

namespace PomodoroApi.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize]
public class TasksController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<TaskResponse>>> GetTasks()
    {
        var userId = GetCurrentUserId();

        var tasks = await db.Tasks
            .Where(t => t.UserId == userId)
            .OrderBy(t => t.CreatedAt)
            .Select(t => ToResponse(t))
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpPost]
    public async Task<ActionResult<TaskResponse>> CreateTask([FromBody] CreateTaskRequest request)
    {
        var userId = GetCurrentUserId();

        var task = new TaskItem
        {
            UserId = userId,
            Title = request.Title.Trim(),
            EstimatedPomodoros = Math.Clamp(request.EstimatedPomodoros, 1, 20),
        };

        db.Tasks.Add(task);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTasks), ToResponse(task));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TaskResponse>> UpdateTask(Guid id, [FromBody] UpdateTaskRequest request)
    {
        var userId = GetCurrentUserId();
        var task = await db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (task is null) return NotFound();

        if (request.Title is not null) task.Title = request.Title.Trim();
        if (request.EstimatedPomodoros.HasValue) task.EstimatedPomodoros = Math.Clamp(request.EstimatedPomodoros.Value, 1, 20);
        if (request.ActualPomodoros.HasValue) task.ActualPomodoros = Math.Max(0, request.ActualPomodoros.Value);
        if (request.IsCompleted.HasValue) task.IsCompleted = request.IsCompleted.Value;
        task.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return Ok(ToResponse(task));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        var userId = GetCurrentUserId();
        var task = await db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (task is null) return NotFound();

        db.Tasks.Remove(task);
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("completed")]
    public async Task<IActionResult> ClearCompleted()
    {
        var userId = GetCurrentUserId();

        await db.Tasks
            .Where(t => t.UserId == userId && t.IsCompleted)
            .ExecuteDeleteAsync();

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
        t.Id, t.Title, t.IsCompleted, t.EstimatedPomodoros, t.ActualPomodoros, t.CreatedAt, t.UpdatedAt
    );
}
