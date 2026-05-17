using EngAce.Domain.Models;
using EngAce.Domain.Models.Enums;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace EngAce.Infrastructure.Extensions;

public static class ConversationEntryExtensions
{
    public static ChatMessageContent ToChatMessageContent(this ConversationEntry entry)
    {
        return new ChatMessageContent
        {
            Role = entry.Role switch
            {
                ConversationRole.User => AuthorRole.User,
                ConversationRole.Assistant => AuthorRole.Assistant,
                ConversationRole.System => AuthorRole.System,
                ConversationRole.Tool => AuthorRole.Tool,
                _ => throw new ArgumentOutOfRangeException()
            },
        };
    }
}