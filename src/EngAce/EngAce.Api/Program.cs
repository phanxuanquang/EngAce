
using EngAce.Api.Options;
using EngAce.Api.Services;
using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using EngAce.Domain.Models.Enums;
using EngAce.Infrastructure;
using EngAce.Infrastructure.Extensions;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Scalar.AspNetCore;
using System.Threading.RateLimiting;

namespace EngAce.Api;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Logging.AddConsole();

        // Add services to the container.

        builder.Services.AddHttpContextAccessor();

        builder.Services.AddScoped<IChatCompletionService>(sp =>
        {
            var httpContextAccessor = sp.GetRequiredService<IHttpContextAccessor>();
            var headers = httpContextAccessor.HttpContext?.Request.Headers;
            var provider = Enum.TryParse<AiServiceProvider>(headers?[nameof(AIServiceCredential.Provider)].ToString(), out var connectorType)
                ? connectorType
                : AiServiceProvider.Gemini;
            var apiKey = headers?[nameof(AIServiceCredential.ApiKey)].ToString().Trim();
            var modelId = headers?[nameof(AIServiceCredential.ModelId)].ToString().Trim();

            var credential = new AIServiceCredential
            {
                ApiKey = string.IsNullOrEmpty(apiKey) ? string.Empty : apiKey,
                ModelId = string.IsNullOrEmpty(modelId) ? provider.GetDefaultConfigurations().DefaultModelId : modelId,
            };

            return Kernel
                .CreateBuilder()
                .AddChatCompletion(credential)
                .Build()
                .GetRequiredService<IChatCompletionService>();
        });

        builder.Services.AddScoped<IAiCredentialManagementService, AiCredentialManagementService>();
        builder.Services.AddInfrastructure();

        // CORS
        const string corsPolicy = "DefaultCors";
        var allowedOrigins = builder.Configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>() ?? [];

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(corsPolicy, policy =>
            {
                if (allowedOrigins is ["*"])
                {
                    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                }
                else
                {
                    policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
                }
            });
        });

        builder.Services
            .AddOptions<RateLimitingOptions>()
            .BindConfiguration(nameof(RateLimitingOptions))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        var rateLimitingOptions = builder.Configuration
            .GetSection(nameof(RateLimitingOptions))
            .Get<RateLimitingOptions>() ?? new RateLimitingOptions();

        builder.Services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.AddFixedWindowLimiter("FixedWindow", limiterOptions =>
            {
                limiterOptions.PermitLimit = rateLimitingOptions.MaxRequestsPerWindow;
                limiterOptions.Window = TimeSpan.FromSeconds(rateLimitingOptions.WindowInSeconds);
                limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                limiterOptions.QueueLimit = rateLimitingOptions.MaxQueuedRequests;
            });
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(ctx =>
                RateLimitPartition.GetFixedWindowLimiter(
                    ctx.Connection.RemoteIpAddress?.ToString() ?? ctx.Request.Headers.Host.ToString(),
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = rateLimitingOptions.MaxRequestsPerWindow,
                        Window = TimeSpan.FromSeconds(rateLimitingOptions.WindowInSeconds),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = rateLimitingOptions.MaxQueuedRequests,
                    }));
        });

        builder.Services.AddControllers();
        builder.Services.AddOpenApi();

        var app = builder.Build();

        app.MapOpenApi();
        app.MapScalarApiReference();

        app.UseHttpsRedirection();
        app.UseCors(corsPolicy);
        app.UseRateLimiter();
        app.UseAuthorization();

        app.MapControllers();

        await app.RunAsync();
    }
}