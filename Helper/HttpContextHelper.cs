using Microsoft.AspNetCore.Http;

namespace Helper
{
    public static class HttpContextHelper
    {
        private static IHttpContextAccessor _accessor;

        public static void Configure(IHttpContextAccessor accessor)
        {
            _accessor = accessor;
        }

        public static string? GetAccessKey()
        {
            if (_accessor.HttpContext.Request.Headers.TryGetValue("Authentication", out var apiKey))
            {
                return apiKey;
            }

            return null;

            //if (_accessor.HttpContext.Request.Headers.TryGetValue("Authentication", out var apiKey))
            //{
            //    return apiKey;
            //}

            //var accessToken = _accessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "access_token")?.Value;
            //if (accessToken != null)
            //{
            //    return accessToken;
            //}

            //return null;
        }

        public static string GetApiKey()
        {
            if (_accessor.HttpContext.Request.Headers.TryGetValue("Authentication", out var apiKey))
            {
                return apiKey;
            }

            return null;
        }
    }
}
