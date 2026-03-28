namespace PomodoroApi.Models;

public class TaskItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int EstimatedPomodoros { get; set; } = 1;
    public int ActualPomodoros { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Guid? ProjectId { get; set; }
    public Project? Project { get; set; }

    public ICollection<PomodoroSession> Sessions { get; set; } = [];
}
