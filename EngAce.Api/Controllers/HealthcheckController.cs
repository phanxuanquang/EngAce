using Events;
using Helper;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthcheckController(ILogger<HealthcheckController> logger) : ControllerBase
    {
        private readonly string _accessKey = HttpContextHelper.GetAccessKey();
        private readonly ILogger<HealthcheckController> _logger = logger;

        [HttpGet]
        public async Task<ActionResult<string>> Healthcheck()
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Invalid Access Key");
            }

            var isValidApiKey = await HealthcheckScope.Healthcheck(_accessKey);
            if (isValidApiKey)
            {
                _logger.LogInformation("Gemini API Key: {ApiKey}", _accessKey);
                return Ok(isValidApiKey);
            }
            else
            {
                return Unauthorized("Invalid Access Key");
            }
        }

        [HttpPost("SendFeedback")]
        public async Task<IActionResult> SendFeedback([FromBody] string userFeedback, string userName)
        {
            _logger.LogInformation($"{userName}'s feedback: {userFeedback}");

            return NoContent();
        }

        [HttpPost("ExtractTextFromImage")]
        public async Task<ActionResult<string>> ExtractTextFromImage([FromBody] string base64Image)
        {
            if (string.IsNullOrEmpty(base64Image))
            {
                return BadRequest("Base64 image is required");
            }

            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Invalid Access Key");
            }

            try
            {
                var content = await HealthcheckScope.ExtractTextFromImage(_accessKey, base64Image);

                if (string.IsNullOrEmpty(content))
                {
                    return BadRequest("Failed to extract text from image");
                }

                return Ok(content);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
