using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IHttpContextAccessor _accessor;

        public AuthController(IHttpContextAccessor httpContextAccessor)
        {
            _accessor = httpContextAccessor;
        }

        [HttpGet("login")]
        public IActionResult Login(string returnUrl = null)
        {
            var authenticationProperties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("GoogleResponse", new { returnUrl })
            };

            return Challenge(authenticationProperties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google-response")]
        public async Task<IActionResult> GoogleResponse()
        {
            var loginResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!loginResult.Succeeded)
            {
                return BadRequest("Cannot login using your Google account");
            }

            var claims = loginResult.Principal.Identities
                .FirstOrDefault()?.Claims
                .Select(claim => new
                {
                    claim.Type,
                    claim.Value
                })
                .ToList();

            var accessToken = claims.FirstOrDefault(x => x.Type == "access_token")?.Value;

            _accessor.HttpContext.Session.SetString("AccessToken", accessToken);

            return Redirect("https://engace-app.azurewebsites.net");
        }
    }
}
