using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;

namespace EngAce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleAuthenticationController : ControllerBase
    {
        private readonly IHttpContextAccessor _accessor;

        public GoogleAuthenticationController(IHttpContextAccessor httpContextAccessor)
        {
            _accessor = httpContextAccessor;
        }

        /// <summary>
        /// Login using Google account
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// This endpoint triggers an OAuth 2.0 authentication flow using Google as the authentication provider.
        /// Currently, it is only available for the Google accounts of the UIT students.
        /// </remarks>
        [HttpGet("login")]
        public IActionResult Login()
        {
            var authenProperties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("GoogleResponse")
            };

            return Challenge(authenProperties, GoogleDefaults.AuthenticationScheme);
        }

        /// <summary>
        /// Get the access token after logging in using Google account
        /// </summary>
        /// <returns></returns>
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

            var accessToken = claims?.FirstOrDefault(x => x.Type == "access_token")?.Value;

            if (accessToken == null)
            {
                return Unauthorized("Access Token not found");
            }

            return Redirect($"https://engace-app.azurewebsites.net/welcome?key={accessToken}");
        }
    }
}
