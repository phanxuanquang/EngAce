using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace EngAce.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class HeathcheckController : ControllerBase
{
    private readonly IAIHealthcheckService _aIHealthcheckService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<HeathcheckController> _logger;

    public HeathcheckController(IAIHealthcheckService aIHealthcheckService, IHttpContextAccessor httpContextAccessor, ILogger<HeathcheckController> logger)
    {
        _aIHealthcheckService = aIHealthcheckService;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    [HttpGet(Name = "heathcheck-ai-service")]
    public async Task<IActionResult> HealthcheckAiService()
    {
        var headers = _httpContextAccessor.HttpContext?.Request.Headers;
        var credential = new AIServiceCredential
        {
            ApiKey = headers?[nameof(AIServiceCredential.ApiKey)].ToString() ?? string.Empty
        };

        if (string.IsNullOrEmpty(credential.ApiKey))
        {
            _logger.LogError("API key is missing in the request headers.");
            return BadRequest(new
            {
                Error = "API key is required in the request headers."
            });
        }

        var result = await _aIHealthcheckService.HealthcheckAiServiceAsync(credential);
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