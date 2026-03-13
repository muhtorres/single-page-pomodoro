using System.ComponentModel.DataAnnotations;

namespace PomodoroApi.DTOs;

public record CreateTaskRequest(
    [Required, MaxLength(500)] string Title,
    int EstimatedPomodoros = 1
);

public record UpdateTaskRequest(
    [MaxLength(500)] string? Title,
    int? EstimatedPomodoros,
    int? ActualPomodoros,
    bool? IsCompleted
);

public record TaskResponse(
    Guid Id,
    string Title,
    bool IsCompleted,
    int EstimatedPomodoros,
    int ActualPomodoros,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
