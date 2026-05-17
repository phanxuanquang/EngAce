using EngAce.Domain.Models.Enums;

namespace EngAce.Domain.Models;

public sealed class ConversationEntry
{
    public string Content { get; init; } = string.Empty;
    public ConversationRole Role { get; init; }
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
}