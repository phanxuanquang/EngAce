using EngAce.Api.DTO;
using Entities;
using Entities.Enums;
using Functions;
using Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System;

namespace EngAce.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizzController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly ILogger<DictionaryController> _logger;

        public QuizzController(IMemoryCache cache, ILogger<DictionaryController> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        /// <summary>
        /// </summary>
        /// <param name="request">The parameters used for quiz generation</param>
        /// <param name="englishLevel">
        /// The English proficiency levels of the user:
        /// 1. Beginner
        /// 2. Intermediate
        /// 3. Advanced
        /// </param>
        /// <param name="totalQuestions">The total questions to generate (maximum value is 30)</param>
        /// <returns>The list of generated quizzes</returns>
        /// <response code="201">The list of generated quizzes</response>
        /// <response code="400">If the request is null or an error occurs during quiz generation</response>
        /// <response code="401">Missing Gemini API Key</response>
        [HttpPost("Generate")]
        public async Task<ActionResult<List<Quizz>>> Generate([FromBody] GenerateQuizzes request, EnglishLevel englishLevel = EnglishLevel.Intermediate, short totalQuestions = 10)
        {
            if (!HttpContext.Request.Headers.TryGetValue("Authentication", out var apiKey))
            {
                return Unauthorized("Missing Gemini API Key");
            }

            if (request == null)
            {
                return BadRequest("Invalid Request");
            }

            if (string.IsNullOrWhiteSpace(request.Topic))
            {
                return BadRequest("The topic must not be empty");
            }

            if (totalQuestions < 1 || totalQuestions > 30)
            {
                return BadRequest("The total questions must be between 1 and 30");
            }

            if (request.QuizzTypes == null || request.QuizzTypes.Count == 0 || request.QuizzTypes.Count > 7)
            {
                return BadRequest("Invalid Quizz Types");
            }

            var cacheKey = $"GenerateQuizzes-{request.Topic.ToLower().Trim()}-{string.Join(string.Empty, request.QuizzTypes)}-{englishLevel}-{totalQuestions}";
            if (_cache.TryGetValue(cacheKey, out List<Quizz> cachedQuizzes))
            {
                return Ok(cachedQuizzes);
            }

            try
            {
                var quizzes = await QuizzScope.GenerateQuizes(apiKey.ToString(), request.Topic, request.QuizzTypes, englishLevel, totalQuestions);
                _cache.Set(cacheKey, quizzes, TimeSpan.FromMinutes(20));

                return Created("Success", quizzes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cannot generate quizzes");
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Suggest topics to choose
        /// </summary>
        /// <returns>10 suggested topics</returns>
        /// <response code="201">The list of 10 suggested topics</response>
        /// <response code="500">Internal Server Error</response>
        [HttpGet("SuggestTopics")]
        public async Task<ActionResult<List<string>>> SuggestTopics(EnglishLevel englishLevel = EnglishLevel.Intermediate)
        {
            var cacheKey = $"SuggestedTopics-{englishLevel}";
            var random = new Random();
            var totalTopics = random.Next(5, 10);

            if (_cache.TryGetValue(cacheKey, out List<string> cachedTopics))
            {
                return Ok(cachedTopics.OrderBy(topic => random.Next()).Take(totalTopics).ToList());
            }

            if (!HttpContext.Request.Headers.TryGetValue("Authentication", out var apiKey))
            {
                return Unauthorized("Missing Gemini API Key");
            }

            try
            {
                var topics = await QuizzScope.SuggestTopcis(apiKey.ToString(), englishLevel);

                var selectedTopics = topics.OrderBy(topic => random.Next()).Take(totalTopics).ToList();
                _cache.Set(cacheKey, topics, TimeSpan.FromDays(7));

                Terminal.Println(string.Join("\n", selectedTopics));
                return Created("Success", selectedTopics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cannot suggest topics");
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Get the levels of English proficiency
        /// </summary>
        /// <returns>The list of English proficiency levels</returns>
        /// <response code="200">The English proficiency levels.</response>
        /// <response code="500">Internal Server Error.</response>
        [HttpGet("GetEnglishLevels")]
        public ActionResult<Dictionary<int, string>> GetEnglishLevels()
        {
            const string cacheKey = "EnglishLevels";
            if (_cache.TryGetValue(cacheKey, out Dictionary<int, string> cachedLevels))
            {
                return Ok(cachedLevels);
            }

            var levels = new List<EnglishLevel>
            {
                EnglishLevel.Beginner,
                EnglishLevel.Intermediate,
                EnglishLevel.Advanced
            };

            var descriptions = levels.ToDictionary(
                level => (int)level,
                level => EnumHelper.GetEnumDescription(level)
            );

            _cache.Set(cacheKey, descriptions, TimeSpan.FromDays(30));
            return Ok(descriptions);
        }

        /// <summary>
        /// Get the types of quizz
        /// </summary>
        /// <returns>The quiz types with their descriptions.</returns>
        /// <response code="200">The quiz types</response>
        /// <response code="500">Internal Server Error</response>
        [HttpGet("GetQuizzTypes")]
        public ActionResult<Dictionary<int, string>> GetQuizzTypes()
        {
            const string cacheKey = "QuizzTypes";
            if (_cache.TryGetValue(cacheKey, out Dictionary<int, string> cachedTypes))
            {
                return Ok(cachedTypes);
            }

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

            var descriptions = types.ToDictionary(
                type => (int)type,
                type => EnumHelper.GetEnumDescription(type)
            );

            _cache.Set(cacheKey, descriptions, TimeSpan.FromDays(15));
            return Ok(descriptions);
        }
    }
}
