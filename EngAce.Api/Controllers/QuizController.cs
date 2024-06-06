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
        /// <param name="request"></param>
        /// <returns>A list of quizes coresponding to the input parameters</returns>
        [HttpPost("Generate")]
        public async Task<List<Quiz>> Generate([FromBody] GenerateQuizzes request)
        {
            try
            {
                return await QuizScope.GenerateQuizes(request.Topics, request.UseJson, request.CreativeLevel, request.Model);
            }
            catch
            {
                throw;
            }
        }
    }
}
