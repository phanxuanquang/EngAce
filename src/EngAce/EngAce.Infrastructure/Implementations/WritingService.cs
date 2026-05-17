using EngAce.Domain.Exceptions;
using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using EngAce.Infrastructure.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using System.Text.Json;

namespace EngAce.Infrastructure.Implementations;

public sealed class WritingService(IAiCredentialManagementService aiCredentialManagementService, IChatCompletionService chatCompletionService, ILogger<WritingService> logger) : IWritingService
{
    private readonly ILogger<WritingService> _logger = logger;
    private readonly IAiCredentialManagementService _aiCredentialManagementService = aiCredentialManagementService;
    private readonly IChatCompletionService _chatCompletionService = chatCompletionService;

    public async Task<WritingReview> GenerateWritingReviewAsync(string requirement, string candidateWriting, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(requirement))
            throw new WritingServiceException("Requirement must not be empty.");

        if (string.IsNullOrWhiteSpace(candidateWriting))
            throw new WritingServiceException("Candidate writing must not be empty.");

        requirement = requirement.Trim();
        candidateWriting = candidateWriting.Trim();

        try
        {
            var credential = await _aiCredentialManagementService.GetCredentialAsync();

            _logger.LogInformation("Generating writing review for requirement: '{Requirement}'", requirement);

            var response = await _chatCompletionService.GetChatMessageContentAsync(
                prompt: $"Review the following English writing.\nRequirement: {requirement}\nCandidate writing: {candidateWriting}\nProvide a detailed review following the defined JSON schema.",
                executionSettings: credential.Provider.CreatePromptExecutionSettingsForJsonOutput<WritingReview>(),
                cancellationToken: cancellationToken);

            return JsonSerializer.Deserialize<WritingReview>(response.Content.AsSpan())
                ?? throw new WritingServiceException("AI returned an empty response for the writing review.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate writing review for requirement '{Requirement}'", requirement);
            throw;
        }
    }

    public async Task<string> ImproveWritingAsync(string requirement, string candidateWriting, WritingReview review, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(requirement))
            throw new WritingServiceException("Requirement must not be empty.");

        if (string.IsNullOrWhiteSpace(candidateWriting))
            throw new WritingServiceException("Candidate writing must not be empty.");

        ArgumentNullException.ThrowIfNull(review);

        requirement = requirement.Trim();
        candidateWriting = candidateWriting.Trim();

        try
        {
            var credential = await _aiCredentialManagementService.GetCredentialAsync();

            _logger.LogInformation("Improving writing for requirement: '{Requirement}'", requirement);

            var chatHistory = new ChatHistory();
            chatHistory.AddUserMessage($"Requirement: {requirement}");
            chatHistory.AddUserMessage($"Candidate writing: {candidateWriting}");
            chatHistory.AddUserMessage($"Review — Overall: {review.OverallFeedback}. Task achievement: {review.TaskAchievement}. Coherence: {review.CoherenceAndCohesion}. Lexical resource: {review.LexicalResource}. Grammar: {review.GrammaticalRangeAndAccuracy}.");
            chatHistory.AddUserMessage("Improve the candidate writing based on the requirement and the review above. Return only the improved writing text.");

            var response = await _chatCompletionService.GetChatMessageContentsAsync(
                chatHistory,
                executionSettings: new PromptExecutionSettings(),
                cancellationToken: cancellationToken);

            return response.LastOrDefault()?.Content
                ?? throw new WritingServiceException("AI returned an empty response for writing improvement.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to improve writing for requirement '{Requirement}'", requirement);
            throw;
        }
    }
}
