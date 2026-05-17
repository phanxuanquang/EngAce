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
        var review = await _writingService.GenerateWritingReviewAsync(request.Requirement, request.CandidateWriting);

        return review is not null
            ? Ok(review)
            : NotFound(new { Message = "Could not generate a review for the provided writing." });
    }

    [HttpPost("Improve")]
    public async Task<ActionResult<string>> ImproveWritingAsync([FromBody] WritingImprovementRequest request)
    {
        var improved = await _writingService.ImproveWritingAsync(request.Requirement, request.CandidateWriting, request.Review);

        return !string.IsNullOrWhiteSpace(improved)
            ? Ok(improved)
            : NotFound(new { Message = "Could not generate an improved version of the provided writing." });
    }
}