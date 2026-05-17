using EngAce.Domain.Exceptions;
using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using EngAce.Infrastructure.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.SemanticKernel.ChatCompletion;
using System.Text.Json;

namespace EngAce.Infrastructure.Implementations;

public sealed class DictionaryService(IAiCredentialManagementService aiCredentialManagementService, IChatCompletionService chatCompletionService, ILogger<DictionaryService> logger) : IDictionaryService
{
    private readonly ILogger<DictionaryService> _logger = logger;
    private readonly IAiCredentialManagementService _aiCredentialManagementService = aiCredentialManagementService;
    private readonly IChatCompletionService _chatCompletionService = chatCompletionService;

    public async Task<IReadOnlyList<WordDefinition>> GetVocabularyAsync(string vocabulary, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(vocabulary))
            throw new DictionaryServiceException("Vocabulary must not be empty.");

        vocabulary = vocabulary.Trim();

        try
        {
            var credential = await _aiCredentialManagementService.GetCredentialAsync();

            _logger.LogInformation("Get definitions for '{Vocabulary}'", vocabulary);
            var response = await _chatCompletionService.GetChatMessageContentAsync(
                prompt: $"Provide detailed definitions in Vietnamese for the English word '{vocabulary}' following the defined JSON schema.",
                executionSettings: credential.Provider.CreatePromptExecutionSettingsForJsonOutput<List<WordDefinition>>(),
                cancellationToken: cancellationToken);

            return JsonSerializer.Deserialize<List<WordDefinition>>(response.Content.AsSpan())
                ?? throw new DictionaryServiceException($"AI returned an empty response for '{vocabulary}'.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to get vocabulary for '{vocabulary}'");
            throw;
        }
    }
}