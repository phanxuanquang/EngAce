using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace EngAce.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DictionaryController(IDictionaryService dictionaryService, ILogger<DictionaryController> logger) : ControllerBase
{
    private readonly IDictionaryService _dictionaryService = dictionaryService;
    private readonly ILogger<DictionaryController> _logger = logger;

    [HttpGet("WordDefinitions")]
    public async Task<ActionResult<IReadOnlyList<WordDefinition>>> GetDefinitionsAsync([Required][MinLength(1, ErrorMessage = "Word must not be empty.")] string word)
    {
        _logger.LogInformation("Received request for definitions of word: {Word}", word);
        var definitions = await _dictionaryService.GetVocabularyAsync(word, HttpContext.RequestAborted);
        return Ok(definitions);
    }
}