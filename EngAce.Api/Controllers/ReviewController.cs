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

        /// <summary>
        /// Generate the comment and the improvement for the essay
        /// </summary>
        /// <param name="content">The content that need the improvement</param>
        /// <param name="englishLevel">The English proficiency level of the user</param>
        /// <returns></returns>
        /// <remarks>
        /// Generate the comment and the improvement for the essay, including the fields: 
        /// - GeneralCommentForTheContent: The overall comment for the whole essay
        /// - ContentWithHighlightedIssues: The original essay with highlighted issues (using markdown format)
        /// - HighlightIssues: The array of highlighted issues in the original essay
        /// - ImprovedContent: The essay after the improvement of the AI
        /// </remarks>
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
