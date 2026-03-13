using System.ComponentModel.DataAnnotations;

namespace PomodoroApi.DTOs;

public record CreateSessionRequest(
    [Required, RegularExpression("^(pomodoro|shortBreak|longBreak)$")]
    string Mode,
    int DurationMinutes,
    Guid? TaskId,
    bool WasCompleted = true
);

public record SessionResponse(
    Guid Id,
    string Mode,
    int DurationMinutes,
    Guid? TaskId,
    bool WasCompleted,
    DateTime CompletedAt
);
