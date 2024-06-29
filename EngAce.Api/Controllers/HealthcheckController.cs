using Events;
using Helper;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthcheckController : ControllerBase
    {
        private readonly string _accessKey;

        public HealthcheckController()
        {
            _accessKey = HttpContextHelper.GetAccessKey();
        }

        [HttpGet]
        public async Task<ActionResult<string>> Healthcheck()
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Incorrect Access Key");
            }

            try
            {
                var result = await HealthcheckScope.Healthcheck(_accessKey);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Unauthorized(ex.Message);
            }
        }
    }
}
