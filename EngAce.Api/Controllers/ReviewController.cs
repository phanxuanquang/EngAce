using EngAce.Api.DTO;
using Events;
using Helper;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController() : ControllerBase
    {
        private readonly string _accessKey = HttpContextHelper.GetAccessKey();

        [HttpPost("Generate")]
        [ResponseCache(Duration = ReviewScope.OneHourAsCachingAge, Location = ResponseCacheLocation.Client, NoStore = false)]
        public async Task<ActionResult<string>> Generate([FromBody] GenerateComment request)
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Invalid Access Key");
            }
            var content = request.Content.Trim();

            if (GeneralHelper.GetTotalWords(content) < ReviewScope.MinTotalWords)
            {
                return BadRequest($"Bài viết phải dài tối thiểu {ReviewScope.MinTotalWords} từ.");
            }

            if (GeneralHelper.GetTotalWords(content) > ReviewScope.MaxTotalWords)
            {
                return BadRequest($"Bài viết không được dài hơn {ReviewScope.MaxTotalWords} từ.");
            }

            try
            {
                var result = await ReviewScope.GenerateReview(_accessKey, request.UserLevel, request.Requirement, request.Content);
                return Ok(result);
            }
            catch
            {
                return Created("Success", "## CẢNH BÁO\n EngAce đang bận đi pha cà phê nên tạm thời vắng mặt. bé yêu vui lòng ngồi chơi 3 phút rồi gửi lại cho EngAce nhận xét nha.\nYêu bé yêu nhiều lắm luôn á!");
            }
        }
    }
}