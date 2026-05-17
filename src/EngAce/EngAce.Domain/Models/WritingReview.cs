namespace EngAce.Domain.Models;

public sealed class WritingReview
{
    public string OverallFeedback { get; init; } = string.Empty;
    public IReadOnlyList<string> Strengths { get; init; } = [];
    public IReadOnlyList<string> AreasForImprovement { get; init; } = [];
    public IReadOnlyList<string> Suggestions { get; init; } = [];
    public string TaskAchievement { get; init; } = string.Empty;
    public string CoherenceAndCohesion { get; init; } = string.Empty;
    public string LexicalResource { get; init; } = string.Empty;
    public string GrammaticalRangeAndAccuracy { get; init; } = string.Empty;
}