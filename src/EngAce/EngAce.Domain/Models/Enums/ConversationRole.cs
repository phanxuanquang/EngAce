using System.Text.Json.Serialization;

namespace EngAce.Domain.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ConversationRole : sbyte
{
    User,
    ToolCalling,
    ToolResponse,
    Bot
}