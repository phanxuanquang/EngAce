using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using EngAce.Domain.Models.Enums;
using EngAce.Infrastructure.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.SemanticKernel.ChatCompletion;

namespace EngAce.Infrastructure.Implementations;

public class ConversationService(IAiCredentialManagementService credentialManagementService, IChatCompletionService chatCompletionService, ILogger<ConversationService> logger) : IConversationService
{
    private readonly IAiCredentialManagementService _credentialManagementService = credentialManagementService;
    private readonly IChatCompletionService _chatCompletionService = chatCompletionService;
    private readonly ILogger<ConversationService> _logger = logger;

    public async Task<IReadOnlyList<ConversationEntry>> GenerateResponsesAsync(IEnumerable<ConversationEntry> conversationHistory, CancellationToken cancellationToken = default)
    {
        var credential = await _credentialManagementService.GetCredentialAsync();

        var chatHistory = new ChatHistory(conversationHistory
            .OrderBy(entry => entry.Timestamp)
            .Select(entry => credential.Provider.CreateChatMessageContent(entry)));

        var responseMessages = await _chatCompletionService.GetChatMessageContentsAsync(chatHistory, cancellationToken: cancellationToken);

        chatHistory.AddRange(responseMessages);

        return chatHistory
            .Select(message =>
            {
                ConversationRole conversationRole;

                if (message.Role.Equals(AuthorRole.System))
                {
                    conversationRole = ConversationRole.System;
                }
                else if (message.Role.Equals(AuthorRole.User))
                {
                    conversationRole = ConversationRole.User;
                }
                else if (message.Role.Equals(AuthorRole.Tool))
                {
                    conversationRole = ConversationRole.Tool;
                }
                else if (message.Role.Equals(AuthorRole.Assistant))
                {
                    conversationRole = ConversationRole.Assistant;
                }
                else
                {
                    _logger.LogWarning("Unknown message role '{MessageRole}' encountered. Defaulting to 'User'.", message.Role);
                    conversationRole = ConversationRole.User;
                }

                return new ConversationEntry
                {
                    Timestamp = DateTime.UtcNow,
                    Content = message.Content?.ToString(),
                    Role = conversationRole
                };
            })
            .ToList();


    }
}