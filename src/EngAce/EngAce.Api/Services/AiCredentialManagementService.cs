using EngAce.Domain.Exceptions;
using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using EngAce.Domain.Models.Enums;
using Microsoft.SemanticKernel.ChatCompletion;
using System.Net;

namespace EngAce.Api.Services;

public class AiCredentialManagementService(IHttpContextAccessor httpContextAccessor, IChatCompletionService chatCompletionService, ILogger<AiCredentialManagementService> logger) : IAiCredentialManagementService
{
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly IChatCompletionService _chatCompletionService = chatCompletionService;
    private readonly ILogger<AiCredentialManagementService> _logger = logger;

    /// <inheritdoc/>
    public Task<AIServiceCredential> GetCredentialAsync()
    {
        var headers = _httpContextAccessor.HttpContext?.Request.Headers;
        var credential = new AIServiceCredential
        {
            ApiKey = headers?[nameof(AIServiceCredential.ApiKey)].ToString() ?? string.Empty,
            ModelId = headers?[nameof(AIServiceCredential.ModelId)].ToString() ?? string.Empty,
            ConnectorType = Enum.TryParse<AiConnectorType>(headers?[nameof(AIServiceCredential.ConnectorType)].ToString(), out var connectorType)
                ? connectorType
                : AiConnectorType.GoogleGemini
        };

        return Task.FromResult(credential);
    }

    /// <inheritdoc/>
    public async Task<AiServiceHealthcheckResult> HealthcheckAiServiceAsync()
    {
        try
        {
            var response = await _chatCompletionService.GetChatMessageContentAsync("Please say *Hello world* without any thinking!");

            return new AiServiceHealthcheckResult
            {
                StatusCode = HttpStatusCode.OK,
                Message = response.Content ?? "AI service healthcheck succeeded, but response content is null."
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "AI service healthcheck failed.");
            return new AiServiceHealthcheckResult
            {
                StatusCode = HttpStatusCode.BadRequest,
                Message = "AI service healthcheck failed.",
                Error = new AIHealthcheckServiceException(ex.Message, ex)
            };
        }
    }
}
