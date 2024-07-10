using Entities;
using Entities.Enums;
using Events;
using Helper;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly string _accessKey;

        public ReviewController(ILogger<DictionaryController> logger)
        {
            _accessKey = HttpContextHelper.GetAccessKey();
        }

        /// <summary>
        /// GenerateResponseForConversation the review and the improvement for the essay
        /// </summary>
        /// <param name="content">The content that need the improvement</param>
        /// <param name="englishLevel">
        /// The English proficiency levels of the user:
        /// 1. Beginner
        /// 2. Elementary
        /// 3. Intermediate
        /// </param>
        /// <returns></returns>
        /// <remarks>
        /// GenerateResponseForConversation the review and the improvement for the essay, including the fields: 
        /// 1. GeneralCommentForTheContent: The overall comment for the whole essay
        /// 2. ContentWithHighlightedIssues: The original essay with highlighted issues (using markdown format)
        /// 3. ImprovedContent: The essay after the improvement of the AI
        /// </remarks>
        [HttpGet("Generate")]
        public async Task<ActionResult<Comment>> Generate(string content, EnglishLevel englishLevel = EnglishLevel.Elementary)
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Incorrect Access Key");
            }

            try
            {
                var result = await ReviewScope.GenerateReview(_accessKey, englishLevel, content);
                return Ok(result);
            }
            catch
            {
                return BadRequest("Có lỗi xảy ra! Vui lòng kiểm tra lại nội dung bài viết và thử lại.");
            }
        }

        [HttpPost("GenerateFromImage")]
        public async Task<ActionResult<CommentFromImage>> GenerateFromImage(IFormFile file, EnglishLevel englishLevel = EnglishLevel.Elementary)
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Incorrect Access Key");
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest("Không có ảnh nào được đăng tải.");
            }

            var maxFileSize = 15 * 1000 * 1000;

            if (file.Length > maxFileSize)
            {
                return BadRequest($"Dung lượng ảnh phải nhỏ hơn {maxFileSize / 1024 / 1024} MB.");
            }

            using (var stream = new MemoryStream())
            {
                try
                {
                    await file.CopyToAsync(stream);
                    stream.Position = 0;

                    var result = await ReviewScope.GenerateReviewFromImage(_accessKey, englishLevel, stream);
                    return Ok(result);
                }
                catch
                {
                    return BadRequest("Có lỗi xảy ra! Vui lòng kiểm tra lại ảnh và thử lại.");
                }

            }
        }
    }
}
