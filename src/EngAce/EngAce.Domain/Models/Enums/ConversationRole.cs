using System.Text.Json.Serialization;

namespace EngAce.Domain.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ConversationRole : sbyte
{
    System = 1,
    User,
    Tool,
    Assistant
}