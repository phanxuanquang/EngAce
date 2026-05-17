using EngAce.Domain.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace EngAce.Domain.Models;

public sealed record AIServiceCredential
{
    [Required]
    public string ApiKey { get; init; } = string.Empty;
    public string ModelId { get; set; } = string.Empty;
    public AiConnectorType ConnectorType { get; init; } = AiConnectorType.GoogleGemini;
}