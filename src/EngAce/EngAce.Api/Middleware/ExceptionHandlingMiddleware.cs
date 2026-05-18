using EngAce.Domain.Exceptions;
using Microsoft.AspNetCore.Http.Features;

namespace EngAce.Api.Middleware;

/// <summary>
/// Catches unhandled exceptions from the rest of the pipeline and maps them to consistent JSON error responses, preventing stack traces from leaking to callers.
/// </summary>
public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested)
        {
            // Client disconnected — no point writing a response.
            logger.LogInformation("Request to {Path} was cancelled by the client.", context.Request.Path);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception for {Method} {Path}.", context.Request.Method, context.Request.Path);
            await WriteErrorAsync(context, ex);
        }
    }

    private static Task WriteErrorAsync(HttpContext context, Exception ex)
    {
        if (context.Response.HasStarted)
            return Task.CompletedTask;

        var (statusCode, message) = ex switch
        {
            DictionaryServiceException => (StatusCodes.Status422UnprocessableEntity, ex.Message),
            ExerciseServiceException => (StatusCodes.Status422UnprocessableEntity, ex.Message),
            WritingServiceException => (StatusCodes.Status422UnprocessableEntity, ex.Message),
            ConversationServiceException => (StatusCodes.Status422UnprocessableEntity, ex.Message),
            NotSupportedException => (StatusCodes.Status400BadRequest, ex.Message),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred. Please try again later."),
        };

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var activity = context.Features.Get<IHttpActivityFeature>()?.Activity;
        activity?.SetStatus(System.Diagnostics.ActivityStatusCode.Error, ex.Message);

        return context.Response.WriteAsJsonAsync(new { Error = message });
    }
}
