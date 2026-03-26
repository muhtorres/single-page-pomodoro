using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PomodoroApi.DTOs;
using PomodoroApi.Models;
using PomodoroApi.Services;

namespace PomodoroApi.Controllers;

[ApiController]
[Route("api/sessions")]
[Authorize]
public class SessionsController(ISessionService sessionService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<SessionResponse>> CreateSession([FromBody] CreateSessionRequest request)
    {
        var (session, error) = await sessionService.CreateSessionAsync(GetCurrentUserId(), request);
        if (error is not null) return BadRequest(error);
        return CreatedAtAction(nameof(CreateSession), ToResponse(session!));
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
