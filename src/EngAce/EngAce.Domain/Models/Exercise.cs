using EngAce.Domain.Models.Enums;

namespace EngAce.Domain.Models;

public sealed record ExerciseEntry
{
    public string Question { get; init; } = string.Empty;
    public ExerciseType Type { get; init; }
    public Dictionary<string, bool> Options { get; init; } = [];
}