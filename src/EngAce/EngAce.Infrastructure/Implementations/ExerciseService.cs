using EngAce.Domain.Exceptions;
using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using EngAce.Domain.Models.Enums;
using EngAce.Infrastructure.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.SemanticKernel.ChatCompletion;
using System.Text.Json;

namespace EngAce.Infrastructure.Implementations;

public sealed class ExerciseService(IAiCredentialManagementService aiCredentialManagementService, IChatCompletionService chatCompletionService, ILogger<ExerciseService> logger) : IExerciseService
{
    private readonly ILogger<ExerciseService> _logger = logger;
    private readonly IAiCredentialManagementService _aiCredentialManagementService = aiCredentialManagementService;
    private readonly IChatCompletionService _chatCompletionService = chatCompletionService;

    public async Task<IReadOnlyList<ExerciseEntry>> GenerateExercisesAsync(string topic, int totalEntries, IEnumerable<ExerciseType> types)
    {
        if (string.IsNullOrWhiteSpace(topic))
            throw new ExerciseServiceException("Topic must not be empty.");

        if (totalEntries <= 0)
            throw new ExerciseServiceException("Total entries must be greater than 0.");

        var typeList = types?.ToList() ?? [];
        if (typeList.Count == 0)
            throw new ExerciseServiceException("At least one 1 type must be specified.");

        topic = topic.Trim();

        try
        {
            var credential = await _aiCredentialManagementService.GetCredentialAsync();
            var typeNames = string.Join(", ", typeList);

            _logger.LogInformation("Generating {TotalEntries} exercises for topic '{Topic}' with types: {Types}", totalEntries, topic, typeNames);

            var response = await _chatCompletionService.GetChatMessageContentAsync(
                prompt: $"Generate {totalEntries} English exercises for the topic '{topic}' covering the following exercise types: {typeNames}. Follow the defined JSON schema.",
                executionSettings: credential.Provider.CreatePromptExecutionSettingsForJsonOutput<List<ExerciseEntry>>());

            return JsonSerializer.Deserialize<List<ExerciseEntry>>(response.ToString())!;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate exercises for topic '{Topic}'", topic);
            throw;
        }
    }
}
