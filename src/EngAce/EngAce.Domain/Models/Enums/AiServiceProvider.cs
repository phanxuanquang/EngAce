using System.Text.Json.Serialization;

namespace EngAce.Domain.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum AiServiceProvider : byte
{
    Gemini,
    OpenAI,
}
