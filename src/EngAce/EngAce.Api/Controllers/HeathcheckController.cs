using EngAce.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace EngAce.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class HeathcheckController : ControllerBase
{
    private readonly IAiCredentialManagementService _credentialManagementService;
    private readonly ILogger<HeathcheckController> _logger;

    public HeathcheckController(IAiCredentialManagementService credentialManagementService, ILogger<HeathcheckController> logger)
    {
        _credentialManagementService = credentialManagementService;
        _logger = logger;
    }

    [HttpGet("heathcheck-ai-service")]
    public async Task<IActionResult> HealthcheckAiService()
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
            return Ok();
        }

        _logger.LogError(result.Error, result.Message);
        return StatusCode((int)HttpStatusCode.BadRequest, new
        {
            Error = result.Error?.Message
        });
    }
}
