using EngAce.Domain.Models;
using EngAce.Domain.Models.Enums;
using Microsoft.AspNetCore.Http.Features;

namespace EngAce.Api.Middleware;

/// <summary>
/// Rejects requests that are missing a valid <see cref="AIServiceCredential.ApiKey"/> or an unrecognised <see cref="AIServiceCredential.Provider"/> header before any scoped services (including the AI client) are created.
/// </summary>
public class AiCredentialMiddleware(RequestDelegate next)
{
    // Prefix paths that do not require credentials (OpenAPI, Scalar, liveness probes).
    private static readonly string[] _exemptPrefixes =
    [
        "/openapi",
        "/scalar",
        "/health",
    ];

    public async Task InvokeAsync(HttpContext context)
    {
        if (!IsExempt(context.Request.Path))
        {
            var headers = context.Request.Headers;

            var apiKey = headers[nameof(AIServiceCredential.ApiKey)].ToString();
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                await WriteErrorAsync(context, StatusCodes.Status400BadRequest,
                    $"The '{nameof(AIServiceCredential.ApiKey)}' request header is required.");
                return;
            }

            var providerHeader = headers[nameof(AIServiceCredential.Provider)].ToString();
            if (!string.IsNullOrWhiteSpace(providerHeader) &&
                !Enum.TryParse<AiServiceProvider>(providerHeader, ignoreCase: true, out _))
            {
                var valid = string.Join(", ", Enum.GetNames<AiServiceProvider>());
                await WriteErrorAsync(context, StatusCodes.Status400BadRequest,
                    $"The '{nameof(AIServiceCredential.Provider)}' header value '{providerHeader}' is not valid. Accepted values: {valid}.");
                return;
            }
        }

        await next(context);
    }

    private static bool IsExempt(PathString path)
    {
        foreach (var prefix in _exemptPrefixes)
        {
            if (path.StartsWithSegments(prefix, StringComparison.OrdinalIgnoreCase))
                return true;
        }
        return false;
    }

    private static Task WriteErrorAsync(HttpContext context, int statusCode, string message)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var activity = context.Features.Get<IHttpActivityFeature>()?.Activity;
        activity?.SetStatus(System.Diagnostics.ActivityStatusCode.Error, message);

        return context.Response.WriteAsJsonAsync(new { Error = message });
    }
}
