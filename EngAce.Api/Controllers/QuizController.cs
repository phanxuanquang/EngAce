using EngAce.Api.DTO;
using Entities;
using Entities.Enums;
using Events;
using Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace EngAce.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly ILogger<DictionaryController> _logger;
        private readonly string _accessKey;

        public QuizController(IMemoryCache cache, ILogger<DictionaryController> logger)
        {
            _cache = cache;
            _logger = logger;
            _accessKey = HttpContextHelper.GetAccessKey();
        }

        /// <summary>
        /// </summary>
        /// <param name="request">
        /// The parameters used for quizz generation:
        /// - Topic: The name of topic
        /// - QuizzTypes: The indexes array of quizz types (further detail can be found in the "api/Quiz/GetQuizTypes" API)
        /// </param>
        /// <param name="englishLevel">
        /// The English proficiency levels of the user:
        /// 1. Beginner
        /// 2. Intermediate
        /// 3. Advanced
        /// </param>
        /// <param name="totalQuestions">The total questions to generate (maximum value is 30)</param>
        /// <returns>The list of generated quizzes</returns>
        [HttpPost("Generate")]
        public async Task<ActionResult<List<Quiz>>> Generate([FromBody] GenerateQuizzes request, EnglishLevel englishLevel = EnglishLevel.Intermediate, short totalQuestions = 10)
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Incorrect Access Key");
            }

            if (string.IsNullOrWhiteSpace(request.Topic))
            {
                return BadRequest("Tên chủ đề không được rỗng");
            }

            if (totalQuestions < 1 || totalQuestions > 30)
            {
                return BadRequest("Số lượng câu hỏi không được lớn hơn 30");
            }

            if (request.QuizzTypes == null || request.QuizzTypes.Count == 0 || request.QuizzTypes.Count > 7)
            {
                return BadRequest("Loại câu hỏi không hợp lệ");
            }

            var cacheKey = $"GenerateQuizzes-{request.Topic.ToLower().Trim()}-{string.Join(string.Empty, request.QuizzTypes)}-{englishLevel}-{totalQuestions}";
            if (_cache.TryGetValue(cacheKey, out List<Quiz> cachedQuizzes))
            {
                return Ok(cachedQuizzes);
            }

            try
            {
                var quizzes = await QuizzScope.GenerateQuizes(_accessKey, request.Topic, request.QuizzTypes, englishLevel, totalQuestions);
                _cache.Set(cacheKey, quizzes, TimeSpan.FromMinutes(20));

                return Created("Success", quizzes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        /// <summary>
        /// Suggest topics to choose
        /// </summary>
        /// <param name="englishLevel">
        /// The English proficiency levels of the user:
        /// 1. Beginner
        /// 2. Intermediate
        /// 3. Advanced
        /// </param>
        /// <returns>3 suggested topics</returns>
        [HttpGet("Suggest3Topics")]
        public async Task<ActionResult<List<string>>> Suggest3Topics(EnglishLevel englishLevel = EnglishLevel.Intermediate)
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Incorrect Access Key");
            }

            const int totalTopics = 3;
            var cacheKey = $"SuggestTopics-{englishLevel}";

            if (_cache.TryGetValue(cacheKey, out List<string> cachedTopics))
            {
                return Ok(cachedTopics.OrderBy(x => Guid.NewGuid()).Take(totalTopics).ToList());
            }

            try
            {
                var topics = await QuizzScope.SuggestTopcis(_accessKey, englishLevel);

                var selectedTopics = topics.OrderBy(x => Guid.NewGuid()).Take(totalTopics).ToList();
                _cache.Set(cacheKey, topics, TimeSpan.FromDays(7));

                return Created("Success", selectedTopics);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        /// <summary>
        /// Get the levels of English proficiency
        /// </summary>
        /// <returns>The list of English proficiency levels</returns>
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
                level => GeneralHelper.GetEnumDescription(level)
            );

            _cache.Set(cacheKey, descriptions, TimeSpan.FromDays(30));
            return Ok(descriptions);
        }

        /// <summary>
        /// Get the types of quizz
        /// </summary>
        /// <returns>The quiz types with their descriptions.</returns>
        [HttpGet("GetQuizTypes")]
        public ActionResult<Dictionary<int, string>> GetQuizTypes()
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
                type => GeneralHelper.GetEnumDescription(type)
            );

            _cache.Set(cacheKey, descriptions, TimeSpan.FromDays(15));
            return Ok(descriptions);
        }
    }
}
