using Events;
using Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Globalization;
using System.Text;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DictionaryController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly ILogger<DictionaryController> _logger;
        private readonly string _accessKey;

        public DictionaryController(IMemoryCache cache, ILogger<DictionaryController> logger)
        {
            _cache = cache;
            _logger = logger;
            _accessKey = HttpContextHelper.GetAccessKey();
        }

        /// <summary>
        /// Search for the explanation for the keyword in the specific context
        /// </summary>
        /// <param name="keyword">The keyword to search</param>
        /// <param name="context">The context that contains the keyword (can be empty)</param>
        /// <param name="useEnglishToExplain">Use English/Vietnamese for the explanation</param>
        /// <returns>The explanation in markdown format</returns>
        [HttpGet("Search")]
        public async Task<ActionResult<string>> Search(string keyword, string context, bool useEnglishToExplain = false)
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Incorrect Access Key");
            }

            if (string.IsNullOrWhiteSpace(keyword))
            {
                return BadRequest("Không được để trống từ khóa");
            }
            if (!string.IsNullOrWhiteSpace(context) && GeneralHelper.CountWords(context) > 100)
            {
                return BadRequest("Ngữ cảnh chỉ chứa tối đa 100 từ");
            }

            if (!string.IsNullOrWhiteSpace(context) && !context.ToLower().Trim().Contains(keyword.ToLower().Trim()))
            {
                return BadRequest("Ngữ cảnh phải chứa từ khóa cần tra cứu");
            }

            if (context.Trim() != new string(context.Trim().Normalize(NormalizationForm.FormD)
                    .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                    .ToArray())
                    .Normalize(NormalizationForm.FormC))
            {
                return BadRequest("Ngữ cảnh phải là tiếng Anh");
            }

            if (keyword.Trim() != new string(keyword.Trim().Normalize(NormalizationForm.FormD)
                .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                .ToArray())
                .Normalize(NormalizationForm.FormC))
            {
                return BadRequest("Từ khóa cần tra cứu phải là tiếng Anh");
            }

            var cacheKey = $"Search: {keyword.ToLower().Trim()}-{context.ToLower().Trim()}-{useEnglishToExplain}";
            if (_cache.TryGetValue(cacheKey, out string cachedResult))
            {
                return Ok(cachedResult);
            }

            try
            {
                var result = await SearchScope.Search(_accessKey, useEnglishToExplain, keyword.Trim(), context.Trim());
                _cache.Set(cacheKey, result, TimeSpan.FromMinutes(15));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}