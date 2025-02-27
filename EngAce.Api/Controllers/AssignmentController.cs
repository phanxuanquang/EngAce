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

        [HttpPost("Generate")]
        public async Task<ActionResult<List<Quiz>>> Generate([FromBody] GenerateQuizzes request)
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

            if (request.TotalQuestions < QuizScope.MinTotalQuestions || request.TotalQuestions > QuizScope.MaxTotalQuestions)
            {
                return BadRequest($"Số lượng câu hỏi phải nằm trong khoảng {QuizScope.MinTotalQuestions} đến {QuizScope.MaxTotalQuestions}");
            }

            if (request.TotalQuestions < request.AssignmentTypes.Count)
            {
                return BadRequest($"Số lượng câu hỏi không được nhỏ hơn số dạng câu hỏi mà bạn chọn");
            }

            var cacheKey = $"GenerateQuiz-{request.Topic.ToLower()}-{string.Join(string.Empty, request.AssignmentTypes)}-{request.EnglishLevel}-{request.TotalQuestions}";
            if (_cache.TryGetValue(cacheKey, out var cachedQuizzes))
            {
                return Ok(cachedQuizzes);
            }

            try
            {
                var quizzes = await QuizScope.GenerateQuizes(_accessKey, request.Topic, request.AssignmentTypes, request.EnglishLevel, request.TotalQuestions);
                _cache.Set(cacheKey, quizzes, TimeSpan.FromMinutes(request.TotalQuestions));

                _logger.LogInformation("{_accessKey} generated: {Topic} - Quizz Types: {Types}", _accessKey[..10], request.Topic, string.Join("-", request.AssignmentTypes.Select(t => t.ToString())));

                return Created("Success", quizzes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Topic: {Topic} - Quizz Types: {Types}", request.Topic, string.Join("-", request.AssignmentTypes.Select(t => t.ToString())));
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("SuggestTopics")]
        public async Task<ActionResult<List<string>>> SuggestTopics(EnglishLevel englishLevel = EnglishLevel.Intermediate)
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Invalid Access Key");
            }

            const int totalTopics = 5;
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
        [ResponseCache(Duration = QuizScope.ThreeDaysAsCachingAge, Location = ResponseCacheLocation.Any, NoStore = false)]
        public ActionResult<Dictionary<int, string>> GetAssignmentTypes()
        {
            var descriptions = Enum
                .GetValues(typeof(AssignmentType))
                .Cast<AssignmentType>()
                .OrderBy(t => GeneralHelper.GetEnumDescription(t))
                .ToDictionary(type => (int)type, type => GeneralHelper.GetEnumDescription(type)
            );

            return Ok(descriptions);
        }
    }
}