using Entities;
using Entities.Enums;
using Functions;
using Helper;
using Microsoft.AspNetCore.Mvc;
using System.Text;

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
        /// Generate the review and the improvement for the essay
        /// </summary>
        /// <param name="content">The content that need the improvement</param>
        /// <param name="englishLevel">
        /// The English proficiency levels of the user:
        /// 1. Beginner
        /// 2. Intermediate
        /// 3. Advanced
        /// </param>
        /// <returns></returns>
        /// <remarks>
        /// Generate the review and the improvement for the essay, including the fields: 
        /// 1. GeneralCommentForTheContent: The overall comment for the whole essay
        /// 2. ContentWithHighlightedIssues: The original essay with highlighted issues (using markdown format)
        /// 3. ImprovedContent: The essay after the improvement of the AI
        /// </remarks>
        [HttpGet("Generate")]
        public async Task<ActionResult<Comment>> Generate(string content, EnglishLevel englishLevel = EnglishLevel.Intermediate)
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
                _logger.LogError(ex, "Không thể phân tích");
                return StatusCode(400, ex.Message);
            }
        }

        /// <summary>
        /// Generate the review and the improvement for the essay
        /// </summary>
        /// <param name="content">The content that need the improvement</param>
        /// <param name="englishLevel">
        /// The English proficiency levels of the user:
        /// 1. Beginner
        /// 2. Intermediate
        /// 3. Advanced
        /// </param>
        /// <remarks>
        /// Generate the review and the improvement for the essay, including the fields: 
        /// 1. GeneralCommentForTheContent: The overall comment for the whole essay
        /// 2. ContentWithHighlightedIssues: The original essay with highlighted issues (using markdown format)
        /// 3. ImprovedContent: The essay after the improvement of the AI
        /// </remarks>
        /// <response code="200">The review as a .HTML file</response>
        /// <response code="400">If the request is null or an error occurs during quiz generation</response>
        /// <response code="401">Missing Gemini API Key</response>
        [HttpGet("GenerateAsHtml")]
        public async Task<ActionResult> GenerateAsHtml(string content, EnglishLevel englishLevel = EnglishLevel.Intermediate)
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Missing Gemini API Key or Access Token");
            }

            try
            {
                var result = await ReviewScope.GenerateReviewAsHtml(_accessKey, englishLevel, content);

                var byteArray = Encoding.UTF8.GetBytes(result);
                var stream = new MemoryStream(byteArray);

                return new FileStreamResult(stream, "text/html")
                {
                    FileDownloadName = $"Review for your content.html"
                };

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Không thể phân tích");
                return StatusCode(400, ex.Message);
            }
        }
    }
}
