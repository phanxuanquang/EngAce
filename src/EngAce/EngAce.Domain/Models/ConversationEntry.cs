using EngAce.Domain.Models.Enums;

namespace EngAce.Domain.Models;

public sealed record ConversationEntry
{
    public string? Content { get; init; }
    public ConversationRole Role { get; init; }
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
}