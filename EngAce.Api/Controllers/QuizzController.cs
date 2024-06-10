using EngAce.Api.DTO;
using Entities;
using Entities.Enums;
using Functions;
using Helper;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizzController : ControllerBase
    {
        /// <summary>
        /// </summary>
        /// <param name="request">The request containing the details for quiz generation.</param>
        /// <param name="englishLevel">
        /// The English proficiency levels of the user:
        /// 1. Beginner
        /// 2. Intermediate
        /// 3. Advanced
        /// </param>
        /// <param name="creativeLevel">
        /// The creativity of the AI for quiz generation. The value must be in the range of 0-100.</param>
        /// <param name="totalQuestions">The total questions to generate.</param>
        /// <returns>The list of generated quizzes</returns>
        /// <response code="201">The list of generated quizzes.</response>
        /// <response code="400">If the request is null or an error occurs during quiz generation.</response>
        /// <response code="401">Missing Gemini API Key.</response>
        [HttpPost("Generate")]
        public async Task<ActionResult<List<Quizz>>> Generate([FromBody] GenerateQuizzes request, EnglishLevel englishLevel = EnglishLevel.Intermediate, int creativeLevel = 25, short totalQuestions = 10)
        {
            if (!HttpContext.Request.Headers.TryGetValue("Authentication", out var apiKey))
            {
                return Unauthorized("Missing Gemini API Key");
            }

            if (request == null)
            {
                return BadRequest("Invalid Request");
            }

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                return BadRequest("Invalid API Key");
            }

            if (string.IsNullOrWhiteSpace(request.Topic) || request.QuizzTypes == null || request.QuizzTypes.Count == 0 || totalQuestions < 1)
            {
                return BadRequest("Invalid Request Parameters");
            }

            try
            {
                var quizzes = await QuizzScope.GenerateQuizes(apiKey.ToString(), request.Topic, request.QuizzTypes, englishLevel, totalQuestions);
                return Created("Success", quizzes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Get the levels of English proficiency
        /// </summary>
        /// <returns>The list of English proficiency levels.</returns>
        /// <response code="200">The English proficiency levels.</response>
        /// <response code="500">Internal Server Error.</response>
        [HttpGet("GetEnglishLevels")]
        public ActionResult<Dictionary<int, string>> GetEnglishLevels()
        {
            var levels = new List<EnglishLevel>()
            {
                EnglishLevel.Beginner,
                EnglishLevel.Intermediate,
                EnglishLevel.Advanced
            };

            var levelNames = levels.ToDictionary(
                level => (int)level,
                level => EnumHelper.GetEnumDescription(level)
            );

            return Ok(levelNames);
        }

        /// <summary>
        /// Get the types of quizz
        /// </summary>
        /// <returns>The quiz types with their descriptions.</returns>
        /// <response code="200">The quiz types.</response>
        /// <response code="500">Internal Server Error.</response>
        [HttpGet("GetQuizzTypes")]
        public ActionResult<Dictionary<int, string>> GetQuizzTypes()
        {
            List<QuizzType> types = new List<QuizzType>
            {
                QuizzType.SentenceCorrection,
                QuizzType.FillTheBlank,
                QuizzType.ReadingComprehension,
                QuizzType.SynonymAndAntonym,
                QuizzType.FunctionalLanguage,
                QuizzType.Vocabulary,
                QuizzType.Grammar
            };

            var typeNames = types.ToDictionary(
                level => (int)level,
                level => EnumHelper.GetEnumDescription(level)
            );

            return Ok(typeNames);
        }
    }
}
