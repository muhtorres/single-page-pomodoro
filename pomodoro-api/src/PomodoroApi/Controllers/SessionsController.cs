using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PomodoroApi.Data;
using PomodoroApi.DTOs;
using PomodoroApi.Models;

namespace PomodoroApi.Controllers;

[ApiController]
[Route("api/sessions")]
[Authorize]
public class SessionsController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<SessionResponse>> CreateSession([FromBody] CreateSessionRequest request)
    {
        var userId = GetCurrentUserId();

        // Validate that the task belongs to this user (if provided)
        if (request.TaskId.HasValue)
        {
            var taskExists = await db.Tasks.AnyAsync(t => t.Id == request.TaskId.Value && t.UserId == userId);
            if (!taskExists) return BadRequest("Task not found or does not belong to this user.");
        }

        var session = new PomodoroSession
        {
            UserId = userId,
            TaskId = request.TaskId,
            Mode = request.Mode,
            DurationMinutes = request.DurationMinutes,
            WasCompleted = request.WasCompleted,
        };

        db.Sessions.Add(session);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(CreateSession), ToResponse(session));
    }

    private Guid GetCurrentUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
               ?? User.FindFirstValue("sub")
               ?? throw new UnauthorizedAccessException();
        return Guid.Parse(sub);
    }

    private static SessionResponse ToResponse(PomodoroSession s) => new(
        s.Id, s.Mode, s.DurationMinutes, s.TaskId, s.WasCompleted, s.CompletedAt
    );
}
