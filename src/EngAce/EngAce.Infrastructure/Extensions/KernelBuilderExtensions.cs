using EngAce.Domain.Models;
using EngAce.Domain.Models.Enums;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace EngAce.Infrastructure.Extensions;

public static class KernelBuilderExtensions
{
    public static IKernelBuilder AddChatCompletion(this IKernelBuilder builder, AIServiceCredential credential)
    {
        switch (credential.Provider)
        {
            case AiServiceProvider.OpenAI:
                builder.AddOpenAIChatCompletion(credential.ModelId, credential.ApiKey);
                break;
            case AiServiceProvider.Gemini:
                builder.AddGoogleAIGeminiChatCompletion(credential.ModelId, credential.ApiKey);
                break;
            default:
                throw new NotSupportedException($"Unsupported AI connector type: {credential.Provider}");
        }
        return builder;
    }

    /// <summary>
    /// Creates an <see cref="IChatCompletionService"/> directly from the credential without
    /// allocating a full <see cref="Kernel"/> and its internal service provider.
    /// </summary>
    public static IChatCompletionService CreateChatCompletionService(AIServiceCredential credential)
    {
        return Kernel.CreateBuilder()
            .AddChatCompletion(credential)
            .Build()
            .GetRequiredService<IChatCompletionService>();
    }
}