using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ConversationController(IConversationService conversationService, ILogger<ConversationController> logger) : ControllerBase
{
    private readonly ILogger<ConversationController> _logger = logger;
    private readonly IConversationService _conversationService = conversationService;

    [HttpPost("SendMessage")]
    public async Task<ActionResult<List<ConversationEntry>>> SendMessageAsync([FromBody] IEnumerable<ConversationEntry> conversationEntries)
    {
        _logger.LogInformation("Received conversation entries: {Count}", conversationEntries.Count());
        var responses = await _conversationService.GenerateResponsesAsync(conversationEntries, HttpContext.RequestAborted);
        return Ok(responses);
    }
}