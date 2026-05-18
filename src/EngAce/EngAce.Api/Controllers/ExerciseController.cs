using EngAce.Api.DTOs;
using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using EngAce.Domain.Models.Enums;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Tags("Exercise")]
public class ExerciseController(IExerciseService exerciseService, ILogger<ExerciseController> logger) : ControllerBase
{
    private readonly IExerciseService _exerciseService = exerciseService;
    private readonly ILogger<ExerciseController> _logger = logger;

    /// <summary>Generate English exercises for a given topic.</summary>
    [HttpPost("Generate")]
    [EndpointSummary("Generate exercises")]
    [EndpointDescription("Generates a set of English exercises for the specified topic. You can optionally filter by exercise type and control the number of items (1–50).")]
    [ProducesResponseType<IReadOnlyList<ExerciseEntry>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<ActionResult<IReadOnlyList<ExerciseEntry>>> GenerateExercisesAsync([FromBody] ExerciseGenerationRequest request)
    {
        _logger.LogInformation("Received exercise generation request for topic: {Topic} with {NumberOfExercises} exercises.", request.Topic, request.NumberOfExercises);
        var exerciseTypes = request.Types?.ToList() ?? [.. Enum.GetValues<ExerciseType>()];
        var result = await _exerciseService.GenerateExercisesAsync(request.Topic, request.NumberOfExercises, exerciseTypes, HttpContext.RequestAborted);
        return Ok(result);
    }

    /// <summary>Get all available exercise types.</summary>
    [HttpGet("Types")]
    [EndpointSummary("Get available exercise types")]
    [EndpointDescription("Returns a dictionary of all supported exercise types and their display names. The response is cached on the client for 6 hours.")]
    [ProducesResponseType<IReadOnlyDictionary<ExerciseType, string>>(StatusCodes.Status200OK)]
    [ResponseCache(Duration = 3600 * 6, Location = ResponseCacheLocation.Client, NoStore = false)]
    public async Task<ActionResult<IReadOnlyDictionary<ExerciseType, string>>> GetAvailableExerciseTypesAsync()
    {
        var result = await _exerciseService.GetAvailableExerciseTypesAsync(HttpContext.RequestAborted);
        return Ok(result);
    }
}
