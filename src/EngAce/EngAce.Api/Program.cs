
using EngAce.Api.Services;
using EngAce.Domain.Interfaces;
using EngAce.Domain.Models;
using EngAce.Domain.Models.Enums;
using EngAce.Infrastructure;
using EngAce.Infrastructure.Extensions;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Scalar.AspNetCore;

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
            var credential = new AIServiceCredential
            {
                ApiKey = headers?[nameof(AIServiceCredential.ApiKey)].ToString() ?? string.Empty,
                ModelId = headers?[nameof(AIServiceCredential.ModelId)].ToString() ?? string.Empty,
                Provider = Enum.TryParse<AiServiceProvider>(headers?[nameof(AIServiceCredential.Provider)].ToString(), out var connectorType)
                    ? connectorType
                    : AiServiceProvider.Gemini
            };
            return Kernel
                .CreateBuilder()
                .AddChatCompletion(credential)
                .Build()
                .GetRequiredService<IChatCompletionService>();
        });

        builder.Services.AddScoped<IAiCredentialManagementService, AiCredentialManagementService>();
        builder.Services.AddInfrastructure();

        builder.Services.AddControllers();
        builder.Services.AddOpenApi();

        var app = builder.Build();

        app.MapOpenApi();
        app.MapScalarApiReference();

        app.UseHttpsRedirection();
        app.UseAuthorization();

        app.MapControllers();

        await app.RunAsync();
    }
}