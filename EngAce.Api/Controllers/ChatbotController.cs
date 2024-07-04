using Entities;
using Events;
using Helper;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    { 
        private readonly ILogger<DictionaryController> _logger;
        private readonly string _accessKey;
        public ChatbotController(ILogger<DictionaryController> logger)
        {
            _logger = logger;
            _accessKey = HttpContextHelper.GetAccessKey();
        }

        [HttpPost("GenerateAnswer")]
        public async Task<ActionResult<string>> GenerateAnswer([FromBody] Conversation request)
        {
            if (string.IsNullOrWhiteSpace(request.Question))
            {
                return BadRequest("The question must not be empty");
            }

            try
            {
                var result = await ChatScope.GenerateAnswer(_accessKey, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
