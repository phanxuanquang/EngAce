namespace EngAce.Domain.Models;

public sealed record AiServiceProviderConfigurations
{
    public required string DefaultModelId { get; init; }
    public string? ModelId { get; init; }
    public string? SystemInstruction { get; init; }
}