using System.ComponentModel.DataAnnotations;

namespace EngAce.Domain.Models;

public sealed record AIServiceCredential
{
    [Required]
    public string ApiKey { get; init; } = string.Empty;
}