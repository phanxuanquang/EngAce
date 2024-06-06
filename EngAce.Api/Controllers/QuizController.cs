using EngAce.Api.DTO;
using Entities;
using Functions;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="request">The request containing the parameters for generating quizzes.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the list of generated quizzes.</returns>
        /// <response code="200">Returns the list of generated quizzes.</response>
        /// <response code="400">If the request is invalid.</response>
        /// <response code="500">If an internal server error occurs.</response>
        [HttpPost("Generate")]
        public async Task<ActionResult<List<Quiz>>> Generate([FromBody] GenerateQuizzes request)
        {
            if (request == null)
            {
                return BadRequest("Invalid Request");
            }

            try
            {
                var quizzes = await QuizScope.GenerateQuizes(request.Topics, request.UseJson = true, request.CreativeLevel, request.Model);
                return Ok(quizzes);
            }
            catch (Exception ex)
            {
                return StatusCode(400, ex.Message);
            }
        }
    }
}
