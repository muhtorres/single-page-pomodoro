namespace PomodoroApi.DTOs;

public record UserResponse(
    Guid Id,
    string Email,
    string Name,
    string? AvatarUrl,
    string Provider,
    DateTime CreatedAt
);
