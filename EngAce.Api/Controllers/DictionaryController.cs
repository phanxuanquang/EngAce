using EngAce.Api.DTO;
using Functions;
using Microsoft.AspNetCore.Mvc;

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
        /// <returns></returns>
        [HttpPost("Search")]
        public async Task<ActionResult<string>> Generate([FromBody] Search request)
        {
            if (!HttpContext.Request.Headers.TryGetValue("Authentication", out var apiKey))
            {
                return Unauthorized("Missing Gemini API Key");
            }

            if (request == null)
            {
                return BadRequest("Invalid Request");
            }

            try
            {
                var quizzes = await SearchScope.Search(apiKey.ToString(), request.Keyword, request.Context);
                return Ok(quizzes);
            }
            catch (Exception ex)
            {
                return StatusCode(400, ex.Message);
            }
        }
    }
}
