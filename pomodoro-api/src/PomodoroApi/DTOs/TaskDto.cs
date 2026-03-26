using System.ComponentModel.DataAnnotations;

namespace PomodoroApi.DTOs;

public record CreateTaskRequest(
    [Required, MaxLength(500)] string Title,
    int EstimatedPomodoros = 1,
    Guid? ProjectId = null
);

public record UpdateTaskRequest(
    [MaxLength(500)] string? Title,
    int? EstimatedPomodoros,
    int? ActualPomodoros,
    bool? IsCompleted,
    Guid? ProjectId = null
);

public record TaskResponse(
    Guid Id,
    string Title,
    bool IsCompleted,
    int EstimatedPomodoros,
    int ActualPomodoros,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    Guid? ProjectId
);
