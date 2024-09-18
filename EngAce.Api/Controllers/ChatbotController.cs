using Entities;
using Events;
using Helper;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController(ILogger<ChatbotController> logger) : ControllerBase
    {
        private readonly ILogger<ChatbotController> _logger = logger;
        private readonly string _accessKey = HttpContextHelper.GetAccessKey();

        /// <summary>
        /// Generates an answer from the chat history and user's question
        /// </summary>
        /// <param name="request">The conversation request containing the question.</param>
        /// <returns>
        /// An <see cref="ActionResult{T}"/> containing the generated answer as a string if the operation is successful,
        /// or a bad request response if the question is empty or an error occurs during the generation.
        /// </returns>
        /// <response code="200">The generated answer as a string.</response>
        /// <response code="400">The error message if the question is empty or if an exception occurs.</response>
        [HttpPost("GenerateAnswer")]
        public async Task<ActionResult<string>> GenerateAnswer([FromBody] Conversation request)
        {
            if (string.IsNullOrWhiteSpace(request.Question))
            {
                return Ok("Gửi vội vậy bạn hiền! Chưa nhập câu hỏi kìa.");
            }

            if (GeneralHelper.GetTotalWords(request.Question) > 15)
            {
                return Ok("Hỏi ngắn thôi cha nội, mắc hỏi quá hay gì 💢\nKiếm câu nào ngắn hơn 15 từ mà hỏi.");
            }

            try
            {
                var result = await ChatScope.GenerateAnswer(_accessKey, request);

                _logger.LogInformation("The question of user {_accessKey}: {Question}", _accessKey[..10], request.Question);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cannot generate answer");
                return Ok("Nhắn từ từ thôi cha nội, vội đi đẻ hay gì 💢\nNgồi đợi 1 phút cho tui đi gặm gói mì tôm đã.");
            }
        }
    }
}