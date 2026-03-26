using System.ComponentModel.DataAnnotations;

namespace PomodoroApi.DTOs;

public record UserResponse(
    Guid Id,
    string Email,
    string Name,
    string? AvatarUrl,
    string Provider,
    DateTime CreatedAt
);

public record DevLoginRequest(
    [Required, MaxLength(200)] string Name,
    [Required, MaxLength(320)] string Email
);

public record DevLoginResponse(string Token);
