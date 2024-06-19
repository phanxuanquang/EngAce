using Functions;
using Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthcheckController : ControllerBase
    {
        private readonly string _accessKey;
        private readonly IMemoryCache _cache;

        public HealthcheckController(IMemoryCache cache)
        {
            _cache = cache;
            _accessKey = HttpContextHelper.GetAccessKey();
        }

        [HttpGet("Healthcheck")]
        public async Task<ActionResult<string>> Healthcheck()
        {
            if (string.IsNullOrEmpty(_accessKey))
            {
                return Unauthorized("Missing Gemini API Key or Access Token");
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
