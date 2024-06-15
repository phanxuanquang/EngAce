using Entities;
using Functions;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {
        [HttpPost("GenerateAnswer")]
        public async Task<ActionResult<string>> GenerateAnswer([FromBody] Chat request)
        {
            if (!HttpContext.Request.Headers.TryGetValue("Authentication", out var apiKey))
            {
                return Unauthorized("Missing Gemini API Key");
            }

            if (request == null)
            {
                return BadRequest("Invalid Request");
            }

            if (string.IsNullOrWhiteSpace(request.Question))
            {
                return BadRequest("The question must not be empty");
            }

            return Ok(ChatbotScope.GenerateAnswer(apiKey.ToString(), request));
        }
    }
}