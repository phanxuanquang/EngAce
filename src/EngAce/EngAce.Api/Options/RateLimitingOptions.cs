using System.ComponentModel.DataAnnotations;

namespace EngAce.Api.Options;

public sealed record RateLimitingOptions
{

    [Range(1, int.MaxValue, ErrorMessage = $"{nameof(MaxRequestsPerWindow)} must be at least 1.")]
    public int MaxRequestsPerWindow { get; init; } = 30;

    [Range(1, int.MaxValue, ErrorMessage = $"{nameof(WindowInSeconds)} must be at least 1 second.")]
    public int WindowInSeconds { get; init; } = 60;

    [Range(0, int.MaxValue, ErrorMessage = $"{nameof(MaxQueuedRequests)} cannot be negative.")]
    public int MaxQueuedRequests { get; init; } = 0;
}
