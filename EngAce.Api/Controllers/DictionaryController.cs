using EngAce.Api.DTO;
using Entities;
using Functions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DictionaryController : ControllerBase
    {
        [HttpPost("Search")]
        public async Task<ActionResult<List<Quiz>>> Generate([FromBody] GenerateQuizzes request, EnumLevel englishLevelOfUser = EnumLevel.Intermediate, int creativeLevel = 25, short totalQuestions = 10)
        {
            if (request == null)
            {
                return BadRequest("Invalid Request");
            }

            try
            {
                var quizzes = await QuizScope.GenerateQuizes(request.ApiKey, request.Topic, request.QuizzTypes, englishLevelOfUser, totalQuestions);
                return Ok(quizzes);
            }
            catch (Exception ex)
            {
                return StatusCode(400, ex.Message);
            }
        }
    }
}
