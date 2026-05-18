using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace EngAce.Api.Controllers;

[ApiController]
[Route("[controller]")]
[Tags("Health")]
public class HeathcheckController(IAiCredentialManagementService credentialManagementService, ILogger<HeathcheckController> logger) : ControllerBase
{
    private readonly IAiCredentialManagementService _credentialManagementService = credentialManagementService;
    private readonly ILogger<HeathcheckController> _logger = logger;

    /// <summary>Check the health of the configured AI service.</summary>
    [HttpGet("AiServiceStatus")]
    [EndpointSummary("AI service health check")]
    [EndpointDescription("Validates the AI service credentials and connectivity by sending a test request. Returns 200 OK on success or 400 Bad Request with error details on failure.")]
    [ProducesResponseType<AiServiceHealthcheckResult>(StatusCodes.Status200OK)]
    [ProducesResponseType<AiServiceHealthcheckResult>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<ActionResult<AiServiceHealthcheckResult>> HealthcheckAiService()
    {
        var result = await _credentialManagementService.HealthcheckAiServiceAsync(HttpContext.RequestAborted);
        if (result.StatusCode == HttpStatusCode.OK)
        {
            _logger.LogInformation("AI service healthcheck successful: {Message}", result.Message);
            return Ok(result);
        }

        _logger.LogError(result.Error, result.Message);
        return BadRequest(result);
    }
}
