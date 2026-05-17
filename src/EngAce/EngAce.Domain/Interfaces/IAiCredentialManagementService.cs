using EngAce.Domain.Models;

namespace EngAce.Domain.Interfaces;

public interface IAiCredentialManagementService
{
    /// <summary>
    /// Retrieves the AI service credential from the current request context.
    /// </summary>
    /// <returns>The <see cref="AIServiceCredential"/> populated from the current HTTP request headers.</returns>
    Task<AIServiceCredential> GetCredentialAsync();

    /// <summary>
    /// Performs a health check on the AI service using the credentials provided in the current request context.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains an <see cref="AiServiceHealthcheckResult"/> indicating the health status of the AI service.</returns>
    Task<AiServiceHealthcheckResult> HealthcheckAiServiceAsync();
}
