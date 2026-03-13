namespace PomodoroApi.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Provider { get; set; } = string.Empty;   // "github" | "google" | "facebook"
    public string ProviderId { get; set; } = string.Empty; // external provider ID
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TaskItem> Tasks { get; set; } = [];
    public ICollection<PomodoroSession> Sessions { get; set; } = [];
}
