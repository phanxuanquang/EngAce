using Entities;
using Events;
using Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DictionaryController(IMemoryCache cache, ILogger<DictionaryController> logger) : ControllerBase
    {
        private readonly IMemoryCache _cache = cache;
        private readonly ILogger<DictionaryController> _logger = logger;
        private readonly string _accessKey = HttpContextHelper.GetAccessKey();

        [HttpGet("Search")]
        [ResponseCache(Duration = QuizScope.ThreeDaysAsCachingAge, Location = ResponseCacheLocation.Any, NoStore = false)]
        public async Task<ActionResult<SearchResult>> Search(string keyword, string? context)
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Invalid Access Key");
            }

            if (string.IsNullOrEmpty(keyword))
            {
                return BadRequest("Không được để trống từ khóa");
            }

            context = string.IsNullOrEmpty(context) ? "" : context.Trim();
            keyword = keyword.ToLower().Trim();

            var cacheKey = $"Search-{keyword}-{context.ToLower()}";
            if (_cache.TryGetValue(cacheKey, out string cachedResult))
            {
                return Ok(cachedResult);
            }

            if (GeneralHelper.GetTotalWords(keyword) > SearchScope.MaxKeywordTotalWords)
            {
                return BadRequest($"Nội dung tra cứu chỉ chứa tối đa {SearchScope.MaxKeywordTotalWords} từ");
            }

            if (!GeneralHelper.IsEnglish(keyword))
            {
                return BadRequest("Từ khóa cần tra cứu phải là tiếng Anh");
            }

            if (!string.IsNullOrEmpty(context))
            {
                if (GeneralHelper.GetTotalWords(context) > SearchScope.MaxContextTotalWords)
                {
                    return BadRequest($"Ngữ cảnh chỉ chứa tối đa {SearchScope.MaxContextTotalWords} từ");
                }

                if (!GeneralHelper.IsEnglish(context))
                {
                    return BadRequest("Ngữ cảnh phải là tiếng Anh");
                }

                if (!context.Contains(keyword, StringComparison.CurrentCultureIgnoreCase))
                {
                    return BadRequest("Ngữ cảnh phải chứa từ khóa cần tra");
                }
            }

            try
            {
                var result = await SearchScope.Search(_accessKey, keyword, context);
                _cache.Set(cacheKey, result, TimeSpan.FromHours(1));

                _logger.LogInformation("{_accessKey} searched: {Keyword} - Context: {Context}", _accessKey[..10], keyword, context);
                return Created("Success", result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cannot search for the explaination of '{Keyword}' in the context '{Context}'", keyword, context);
                return Created("Success", "## CẢNH BÁO\n EngAce đang bận đi pha cà phê nên tạm thời vắng mặt. Bạn yêu vui lòng ngồi chơi 3 phút rồi tra lại thử nha.\nYêu bạn hiền nhiều lắm luôn á!");
            }
        }
    }
}