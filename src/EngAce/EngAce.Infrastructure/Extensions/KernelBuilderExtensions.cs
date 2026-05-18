using EngAce.Domain.Models;
using EngAce.Domain.Models.Enums;
using Microsoft.SemanticKernel;

namespace EngAce.Infrastructure.Extensions;

public static class KernelBuilderExtensions
{
    public static IKernelBuilder AddCommonChatCompletionService(this IKernelBuilder builder, AIServiceCredential credential)
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
}