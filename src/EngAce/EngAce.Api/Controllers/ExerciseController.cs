using EngAce.Api.DTOs;
using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using EngAce.Domain.Models.Enums;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ExerciseController(IExerciseService exerciseService, ILogger<ExerciseController> logger) : ControllerBase
{
    private readonly IExerciseService _exerciseService = exerciseService;
    private readonly ILogger<ExerciseController> _logger = logger;

    [HttpPost("Generate")]
    public async Task<ActionResult<IReadOnlyList<ExerciseEntry>>> GenerateExercisesAsync([FromBody] ExerciseGenerationRequest request)
    {
        _logger.LogInformation("Received exercise generation request for topic: {Topic} with {NumberOfExercises} exercises.", request.Topic, request.NumberOfExercises);
        var exerciseTypes = request.Types?.ToList() ?? [.. Enum.GetValues<ExerciseType>()];
        var result = await _exerciseService.GenerateExercisesAsync(request.Topic, request.NumberOfExercises, exerciseTypes, HttpContext.RequestAborted);
        return Ok(result);
    }

    [HttpGet("Types")]
    [ResponseCache(Duration = 3600 * 6, Location = ResponseCacheLocation.Client, NoStore = false)]
    public async Task<ActionResult<IReadOnlyDictionary<ExerciseType, string>>> GetAvailableExerciseTypesAsync()
    {
        var result = await _exerciseService.GetAvailableExerciseTypesAsync(HttpContext.RequestAborted);
        return Ok(result);
    }
}
