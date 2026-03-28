using System.ComponentModel.DataAnnotations;

namespace PomodoroApi.DTOs;

public record CreateTaskRequest(
    [Required, MaxLength(500)] string Title,
    [MaxLength(2000)] string? Description = null,
    int EstimatedPomodoros = 1,
    Guid? ProjectId = null
);

public record UpdateTaskRequest(
    [MaxLength(500)] string? Title,
    [MaxLength(2000)] string? Description,
    int? EstimatedPomodoros,
    int? ActualPomodoros,
    bool? IsCompleted,
    DateTime? CompletedAt,
    Guid? ProjectId = null
);

public record TaskResponse(
    Guid Id,
    string Title,
    string? Description,
    bool IsCompleted,
    DateTime? CompletedAt,
    int EstimatedPomodoros,
    int ActualPomodoros,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    Guid? ProjectId
);
