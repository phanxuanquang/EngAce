using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace EngAce.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class HeathcheckController(IAiCredentialManagementService credentialManagementService, ILogger<HeathcheckController> logger) : ControllerBase
{
    private readonly IAiCredentialManagementService _credentialManagementService = credentialManagementService;
    private readonly ILogger<HeathcheckController> _logger = logger;

    [HttpGet("AiServiceStatus")]
    public async Task<ActionResult<AiServiceHealthcheckResult>> HealthcheckAiService()
    {
        var credential = await _credentialManagementService.GetCredentialAsync();

        if (string.IsNullOrEmpty(credential.ApiKey))
        {
            _logger.LogError("API key is missing in the request headers.");
            return BadRequest(new
            {
                Error = "API key is required in the request headers."
            });
        }

        var result = await _credentialManagementService.HealthcheckAiServiceAsync();
        if (result.StatusCode == HttpStatusCode.OK)
        {
            _logger.LogInformation("AI service healthcheck successful for API key: {ApiKey}", credential.ApiKey);
            return Ok(result);
        }

        _logger.LogError(result.Error, result.Message);
        return BadRequest(result);
    }
}
