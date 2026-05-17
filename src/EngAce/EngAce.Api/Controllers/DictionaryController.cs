using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DictionaryController : ControllerBase
{
    private readonly IDictionaryService _dictionaryService;
    private readonly ILogger<DictionaryController> _logger;

    public DictionaryController(IDictionaryService dictionaryService, ILogger<DictionaryController> logger)
    {
        _dictionaryService = dictionaryService;
        _logger = logger;
    }

    [HttpGet("WordDefinitions")]
    public async Task<ActionResult<List<WordDefinition>>> GetDefinitionsAsync(string word)
    {
        return await _dictionaryService.GetVocabularyAsync(word) is List<WordDefinition> definitions
            ? Ok(definitions)
            : NotFound(new { Message = $"No definitions found for '{word}'." });
    }
}