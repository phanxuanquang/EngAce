using EngAce.Domain.Models;

namespace EngAce.Domain.Interfaces;

public interface IAIHealthcheckService
{
    /// <summary>
    /// Performs a health check on the specified AI service provider by making a test API call using the provided credentials.
    /// </summary>
    /// <param name="aIServiceProvider">The AI service provider containing the credentials to be validated.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains an <see cref="AiServiceHealthcheckResult"/> indicating the health status of the AI service.</returns>
    Task<AiServiceHealthcheckResult> HealthcheckAiServiceAsync(AIServiceCredential aIServiceProvider);
}