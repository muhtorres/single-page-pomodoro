namespace PomodoroApi.Models;

public class PomodoroSession
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid? TaskId { get; set; }   // null = session without a selected task
    public TaskItem? Task { get; set; }
    public string Mode { get; set; } = string.Empty;  // "pomodoro" | "shortBreak" | "longBreak"
    public int DurationMinutes { get; set; }
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    public bool WasCompleted { get; set; }  // false = session was cancelled/reset
}
