using EngAce.Api.DTO;
using Entities;
using Functions;
using Helper;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        /// <summary>
        /// Generate quizzes
        /// </summary>
        /// <param name="request">The request containing the details for quiz generation.</param>
        /// <param name="englishLevelOfUser">The English proficiency level of the user, including Beginner (1), 2 (Intermediate), and 3 (Advanced). Default value is 2 (Intermediate).</param>
        /// <param name="creativeLevel">The creativity level for quiz generation in the range of 0-100. Defaults to 25.</param>
        /// <param name="totalQuestions">The total number of questions to generate. Defaults to 10.</param>
        /// <returns>A list of generated quizzes if successful; otherwise, an appropriate error response.</returns>
        /// <response code="200">Returns the list of generated quizzes.</response>
        /// <response code="400">If the request is null or an error occurs during quiz generation.</response>
        [HttpPost("Generate")]
        public async Task<ActionResult<List<Quiz>>> Generate([FromBody] GenerateQuizzes request, EnumLevel englishLevelOfUser = EnumLevel.Intermediate, int creativeLevel = 25, short totalQuestions = 10)
        {
            if (request == null)
            {
                return BadRequest("Invalid Request");
            }

            try
            {
                var quizzes = await QuizScope.GenerateQuizes(request.ApiKey, request.Topic, request.QuizzTypes, englishLevelOfUser, totalQuestions);
                return Ok(quizzes);
            }
            catch (Exception ex)
            {
                return StatusCode(400, ex.Message);
            }
        }

        /// <summary>
        /// Get the list of English proficiency levels
        /// </summary>
        /// <returns>The list of English proficiency levels.</returns>
        /// <response code="200">Returns the list of English proficiency levels.</response>
        /// <response code="500">Internal Server Error.</response>
        [HttpGet("GetEnglishLevels")]
        public async Task<ActionResult<List<string>>> GetEnglishLevels()
        {
            var levels = new List<EnumLevel>()
            {
                EnumLevel.Beginner,
                EnumLevel.Intermediate,
                EnumLevel.Advanced
            };
            var levelNames = levels.Select(level => EnumHelper.GetEnumDescription(level)).ToList();

            return Ok(levelNames);
        }

        /// <summary>
        /// Get the list of quizz types
        /// </summary>
        /// <returns>The list of quiz types with their descriptions.</returns>
        /// <response code="200">Returns the list of quiz types.</response>
        /// <response code="500">Internal Server Error.</response>
        [HttpGet("GetQuizzTypes")]
        public async Task<ActionResult<List<string>>> GetQuizzTypes()
        {
            List<EnumQuizzType> types = new List<EnumQuizzType>
            {
                EnumQuizzType.SentenceCorrection,
                EnumQuizzType.FillTheBlank,
                EnumQuizzType.ReadingComprehension,
                EnumQuizzType.SynonymAndAntonym,
                EnumQuizzType.FunctionalLanguage,
                EnumQuizzType.Vocabulary,
                EnumQuizzType.Grammar
            };

            var typeNames = types.Select(level => EnumHelper.GetEnumDescription(level)).ToList();
            return Ok(typeNames);
        }
    }
}
