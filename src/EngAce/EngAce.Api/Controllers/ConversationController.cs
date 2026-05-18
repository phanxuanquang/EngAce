using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace EngAce.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Tags("Conversation")]
public class ConversationController(IConversationService conversationService, ILogger<ConversationController> logger) : ControllerBase
{
    private readonly ILogger<ConversationController> _logger = logger;
    private readonly IConversationService _conversationService = conversationService;

    /// <summary>Send a message and get AI responses.</summary>
    [HttpPost("SendMessage")]
    [EndpointSummary("Send a conversation message")]
    [EndpointDescription("Sends a list of conversation entries (chat history) to the AI and returns the updated conversation including the AI's response.")]
    [ProducesResponseType<IReadOnlyList<ConversationEntry>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<ActionResult<IReadOnlyList<ConversationEntry>>> SendMessageAsync([FromBody][Required][MinLength(1, ErrorMessage = "At least one conversation entry is required.")] List<ConversationEntry> conversationEntries)
    {
        _logger.LogInformation("Received conversation entries: {Count}", conversationEntries.Count());
        var responses = await _conversationService.GenerateResponsesAsync(conversationEntries, HttpContext.RequestAborted);
        return Ok(responses);
    }
}