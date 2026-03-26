using System.ComponentModel.DataAnnotations;

namespace PomodoroApi.DTOs;

public record CreateProjectRequest(
    [Required, MaxLength(100)] string Name,
    [MaxLength(20)] string? Color
);

public record UpdateProjectRequest(
    [MaxLength(100)] string? Name,
    [MaxLength(20)] string? Color
);

public record ProjectResponse(
    Guid Id,
    string Name,
    string Color,
    bool IsDefault,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
