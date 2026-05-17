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
    public async Task<ActionResult<List<ExerciseEntry>>> GenerateExercisesAsync([FromBody] ExerciseGenerationRequest request)
    {
        var exerciseTypes = request.Types?.ToList() ?? Enum.GetValues<ExerciseType>().ToList();
        var result = await _exerciseService.GenerateExercisesAsync(request.Topic, request.NumberOfExercises, exerciseTypes);

        return result is { Count: > 0 }
            ? Ok(result)
            : NotFound(new { Message = $"No exercises could be generated for topic '{request.Topic}'." });
    }
}
