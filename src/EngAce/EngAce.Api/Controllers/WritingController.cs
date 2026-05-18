using EngAce.Api.DTOs;
using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Tags("Writing")]
public class WritingController(IWritingService writingService, ILogger<WritingController> logger) : ControllerBase
{
    private readonly IWritingService _writingService = writingService;
    private readonly ILogger<WritingController> _logger = logger;

    /// <summary>Review a candidate's English writing.</summary>
    [HttpPost("Review")]
    [EndpointSummary("Review candidate writing")]
    [EndpointDescription("Analyzes the candidate's writing against the given requirement and returns a detailed AI-generated review covering grammar, coherence, vocabulary, and task achievement.")]
    [ProducesResponseType<WritingReview>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<ActionResult<WritingReview>> GenerateWritingReviewAsync([FromBody] WritingReviewRequest request)
    {
        _logger.LogInformation("Received writing review request for requirement:{Requirement}", request.Requirement);
        var review = await _writingService.GenerateWritingReviewAsync(request.Requirement, request.CandidateWriting, HttpContext.RequestAborted);
        return Ok(review);
    }

    /// <summary>Improve a candidate's English writing.</summary>
    [HttpPost("Improve")]
    [EndpointSummary("Improve candidate writing")]
    [EndpointDescription("Takes the original writing requirement, the candidate's response, and a prior review, then returns an AI-improved version of the writing.")]
    [ProducesResponseType<string>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<ActionResult<string>> ImproveWritingAsync([FromBody] WritingImprovementRequest request)
    {
        _logger.LogInformation("Received writing improvement request for requirement:{Requirement}", request.Requirement);
        var improved = await _writingService.ImproveWritingAsync(request.Requirement, request.CandidateWriting, request.Review, HttpContext.RequestAborted);
        return Ok(improved);
    }
}