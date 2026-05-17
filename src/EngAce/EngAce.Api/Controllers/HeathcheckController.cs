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
        var result = await _credentialManagementService.HealthcheckAiServiceAsync();
        if (result.StatusCode == HttpStatusCode.OK)
        {
            _logger.LogInformation("AI service healthcheck successful: {Message}", result.Message);
            return Ok(result);
        }

        _logger.LogError(result.Error, result.Message);
        return BadRequest(result);
    }
}
