using EngAce.Api.DTOs;
using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class WritingController(IWritingService writingService, ILogger<WritingController> logger) : ControllerBase
{
    private readonly IWritingService _writingService = writingService;
    private readonly ILogger<WritingController> _logger = logger;

    [HttpPost("Review")]
    public async Task<ActionResult<WritingReview>> GenerateWritingReviewAsync([FromBody] WritingReviewRequest request)
    {
        _logger.LogInformation("Received writing review request for requirement:{Requirement}", request.Requirement);
        var review = await _writingService.GenerateWritingReviewAsync(request.Requirement, request.CandidateWriting, HttpContext.RequestAborted);
        return Ok(review);
    }

    [HttpPost("Improve")]
    public async Task<ActionResult<string>> ImproveWritingAsync([FromBody] WritingImprovementRequest request)
    {
        _logger.LogInformation("Received writing improvement request for requirement:{Requirement}", request.Requirement);
        var improved = await _writingService.ImproveWritingAsync(request.Requirement, request.CandidateWriting, request.Review, HttpContext.RequestAborted);
        return Ok(improved);
    }
}