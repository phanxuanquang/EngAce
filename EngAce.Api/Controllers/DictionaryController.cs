using EngAce.Api.DTO;
using Entities;
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
        public async Task<ActionResult<List<Quiz>>> Generate([FromBody] SearchContent request)
        {
            if (request == null)
            {
                return BadRequest("Invalid Request");
            }

            try
            {
                var quizzes = await SearchScope.Search(request.ApiKey, request.Keyword, request.Context);
                return Ok(quizzes);
            }
            catch (Exception ex)
            {
                return StatusCode(400, ex.Message);
            }
        }
    }
}
