using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EngAce.Api.Controllers
{
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

        [HttpGet]
        public async Task<ActionResult<List<WordDefinition>>> GetDefinitionsAsync(string vocabulary)
        {
            return await _dictionaryService.GetVocabularyAsync(vocabulary) is List<WordDefinition> definitions
                ? Ok(definitions)
                : NotFound(new { Message = $"No definitions found for '{vocabulary}'." });
        }
    }
}
