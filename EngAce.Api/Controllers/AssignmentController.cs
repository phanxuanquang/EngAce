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
    public class AssignmentController(IMemoryCache cache, ILogger<AssignmentController> logger) : ControllerBase
    {
        private readonly IMemoryCache _cache = cache;
        private readonly ILogger<AssignmentController> _logger = logger;
        private readonly string _accessKey = HttpContextHelper.GetAccessKey();

        /// <summary>
        /// Generates a list of quizzes based on the specified request, English level, and total number of questions.
        /// </summary>
        /// <param name="request">The request containing the topic and quiz types.</param>
        /// <param name="englishLevel">The English level for which to generate quizzes. Default is Intermediate.</param>
        /// <param name="totalQuestions">The total number of questions to generate. Default is 10.</param>
        /// <returns>
        /// An <see cref="ActionResult{T}"/> containing a list of generated quizzes if the operation is successful,
        /// or an error response if the access key is invalid, the topic is empty, the total number of questions is out of range, or an exception occurs during generation.
        /// </returns>
        /// <response code="200">The list of generated quizzes from the cache if available.</response>
        /// <response code="201">The list of generated quizzes after performing the generation successfully.</response>
        /// <response code="400">The error message if the topic is empty, the total number of questions is out of range, or an error occurs during generation.</response>
        /// <response code="401">The error message if the access key is invalid.</response>
        [HttpPost("Generate")]
        public async Task<ActionResult<List<Quiz>>> Generate([FromBody] GenerateQuizzes request, EnglishLevel englishLevel = EnglishLevel.Intermediate, short totalQuestions = 10)
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Invalid Access Key");
            }

            request.Topic = string.IsNullOrEmpty(request.Topic) ? "" : request.Topic.Trim();

            if (string.IsNullOrWhiteSpace(request.Topic))
            {
                return BadRequest("Tên chủ đề không được để trống");
            }

            if (GeneralHelper.GetTotalWords(request.Topic) > QuizScope.MaxTotalWordsOfTopic)
            {
                return BadRequest($"Chủ đề không được chứa nhiều hơn {QuizScope.MaxTotalWordsOfTopic} từ");
            }

            if (totalQuestions < QuizScope.MinTotalQuestions || totalQuestions > QuizScope.MaxTotalQuestions)
            {
                return BadRequest($"Số lượng câu hỏi phải nằm trong khoảng {QuizScope.MinTotalQuestions} đến {QuizScope.MaxTotalQuestions}");
            }

            if (totalQuestions < request.QuizzTypes.Count)
            {
                return BadRequest($"Tổng số câu hỏi không được nhỏ hơn số loại câu hỏi mà bạn chọn");
            }

            var cacheKey = $"GenerateQuiz-{request.Topic.ToLower()}-{string.Join(string.Empty, request.QuizzTypes)}-{englishLevel}-{totalQuestions}";
            if (_cache.TryGetValue(cacheKey, out var cachedQuizzes))
            {
                return Ok(cachedQuizzes);
            }

            try
            {
                var quizzes = await QuizScope.GenerateQuizes(_accessKey, request.Topic, request.QuizzTypes, englishLevel, totalQuestions);
                _cache.Set(cacheKey, quizzes, TimeSpan.FromMinutes(totalQuestions));

                _logger.LogInformation("{_accessKey} generated: {Topic} - Quizz Types: {Types}", _accessKey[..10], request.Topic, string.Join("-", request.QuizzTypes.Select(t => t.ToString())));

                return Created("Success", quizzes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Topic: {Topic} - Quizz Types: {Types}", request.Topic, string.Join("-", request.QuizzTypes.Select(t => t.ToString())));
                return BadRequest("Hệ thống mắc đi đẻ, vui lòng đợi 3 phút rồi thử lại nha!");
            }
        }

        /// <summary>
        /// Suggests 3 topics based on the specified English level
        /// </summary>
        /// <param name="englishLevel">The English level for which to suggest topics. Default is Intermediate.</param>
        /// <returns>
        /// An <see cref="ActionResult{T}"/> containing a list of three suggested topics if the operation is successful,
        /// or an error response if the access key is invalid or if an exception occurs during the suggestion process.
        /// </returns>
        /// <response code="200">The list of three suggested topics from the cache if available.</response>
        /// <response code="201">The list of three suggested topics after performing the suggestion successfully.</response>
        /// <response code="400">The error message if an error occurs during the suggestion process.</response>
        /// <response code="401">The error message if the access key is invalid.</response>
        [HttpGet("Suggest3Topics")]
        public async Task<ActionResult<List<string>>> Suggest3Topics(EnglishLevel englishLevel = EnglishLevel.Intermediate)
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Invalid Access Key");
            }

            const int totalTopics = 3;
            var cacheKey = $"SuggestTopics-{englishLevel}";

            if (_cache.TryGetValue(cacheKey, out List<string> cachedTopics))
            {
                return Ok(cachedTopics
                    .OrderBy(x => Guid.NewGuid())
                    .Take(totalTopics)
                    .ToList());
            }

            try
            {
                var topics = await QuizScope.SuggestTopcis(_accessKey, englishLevel);

                var selectedTopics = topics
                    .OrderBy(x => Guid.NewGuid())
                    .Take(totalTopics)
                    .ToList();

                _cache.Set(cacheKey, topics, TimeSpan.FromDays(QuizScope.ThreeDaysAsCachingAge));

                return Created("Success", selectedTopics);
            }
            catch
            {
                return BadRequest("Không thể gợi ý chủ đề. Vui lòng thử lại.");
            }
        }

        /// <summary>
        /// Retrieves a dictionary of English levels with their descriptions
        /// </summary>
        /// <returns>
        /// An <see cref="ActionResult{T}"/> containing a dictionary of English levels and their descriptions if the operation is successful.
        /// </returns>
        /// <response code="200">Returns a dictionary of English levels and their descriptions.</response>
        [HttpGet("GetEnglishLevels")]
        [ResponseCache(Duration = QuizScope.MaxTimeAsCachingAge, Location = ResponseCacheLocation.Any, NoStore = false)]
        public ActionResult<Dictionary<int, string>> GetEnglishLevels()
        {
            var descriptions = Enum
                .GetValues(typeof(EnglishLevel))
                .Cast<EnglishLevel>()
                .ToDictionary(level => (int)level, level => GeneralHelper.GetEnumDescription(level)
            );

            return Ok(descriptions);
        }

        /// <summary>
        /// Retrieves a dictionary of quiz types with their descriptions
        /// </summary>
        /// <returns>
        /// An <see cref="ActionResult{T}"/> containing a dictionary of quiz types and their descriptions if the operation is successful.
        /// </returns>
        /// <response code="200">Returns a dictionary of quiz types and their descriptions.</response>
        [HttpGet("GetAssignmentTypes")]
        [ResponseCache(Duration = QuizScope.MaxTimeAsCachingAge, Location = ResponseCacheLocation.Any, NoStore = false)]
        public ActionResult<Dictionary<int, string>> GetAssignmentTypes()
        {
            var descriptions = Enum
                .GetValues(typeof(QuizzType))
                .Cast<QuizzType>()
                .OrderBy(t => GeneralHelper.GetEnumDescription(t))
                .ToDictionary(type => (int)type, type => GeneralHelper.GetEnumDescription(type)
            );

            return Ok(descriptions);
        }
    }
}