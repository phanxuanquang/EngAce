using EngAce.Api.DTO;
using Events;
using Helper;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

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

        [HttpGet("GetLatestGithubCommit")]
        [ResponseCache(Duration = 60 * 60 * 2, Location = ResponseCacheLocation.Any, NoStore = false)]
        public async Task<ActionResult<CommitInfo>> GetLatestGithubCommit()
        {
            try
            {
                using var client = new HttpClient();
                using var request = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/repos/phanxuanquang/EngAce/commits/master");
                request.Headers.Add("User-Agent", "request");

                using var response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                return Ok(new CommitInfo
                {
                    ShaCode = root.GetProperty("sha").GetString(),
                    Message = root.GetProperty("commit").GetProperty("message").GetString().Replace("`", "**"),
                    Date = root.GetProperty("commit").GetProperty("author").GetProperty("date").GetDateTime()
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
