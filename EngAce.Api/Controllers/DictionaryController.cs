using Entities;
using Functions;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Text;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DictionaryController : ControllerBase
    {
        /// <summary>
        /// Search the explanation of an English word in the specific context
        /// </summary>
        /// <param name="request"></param>
        /// <param name="useEnglishToExplain">Use English for the explanation</param>
        /// <returns></returns>
        [HttpPost("Search")]
        public async Task<ActionResult<string>> Search([FromBody] Search request, bool useEnglishToExplain = false)
        {
            if (!HttpContext.Request.Headers.TryGetValue("Authentication", out var apiKey))
            {
                return Unauthorized("Missing Gemini API Key");
            }

            if (request == null)
            {
                return BadRequest("Invalid Request");
            }

            if (string.IsNullOrWhiteSpace(request.Keyword))
            {
                return BadRequest("The keyword must not be empty");
            }

            if (!string.IsNullOrWhiteSpace(request.Context) && !request.Context.ToLower().Trim().Contains(request.Keyword.ToLower().Trim()))
            {
                return BadRequest("The keyword must appear in the context");
            }

            if (useEnglishToExplain)
            {
                if (request.Context.Trim() != new string(request.Context.Trim().Normalize(NormalizationForm.FormD)
                    .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                    .ToArray())
                    .Normalize(NormalizationForm.FormC))
                {
                    return BadRequest("The context must be in English");
                }

                if (request.Keyword.Trim() != new string(request.Keyword.Trim().Normalize(NormalizationForm.FormD)
                    .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                    .ToArray())
                    .Normalize(NormalizationForm.FormC))
                {
                    return BadRequest("The keyword must be in English");
                }
            }

            try
            {
                var quizzes = await SearchScope.Search(apiKey.ToString(), useEnglishToExplain, request.Keyword.Trim(), request.Context.Trim());
                return Ok(quizzes);
            }
            catch (Exception ex)
            {
                return StatusCode(400, ex.Message);
            }
        }
    }
}
