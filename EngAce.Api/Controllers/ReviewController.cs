using Entities.Enums;
using Functions;
using Helper;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly ILogger<DictionaryController> _logger;
        private readonly string _accessKey;

        public ReviewController(ILogger<DictionaryController> logger)
        {
            _logger = logger;
            _accessKey = HttpContextHelper.GetAccessKey();
        }

        [HttpGet("Generate")]
        public async Task<ActionResult<string>> Generate(string content, EnglishLevel englishLevel = EnglishLevel.Intermediate)
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Missing Gemini API Key or Access Token");
            }

            try
            {
                var result = await ReviewScope.GenerateReview(_accessKey, englishLevel, content);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cannot find the explanation");
                return StatusCode(400, ex.Message);
            }
        }
    }
}
