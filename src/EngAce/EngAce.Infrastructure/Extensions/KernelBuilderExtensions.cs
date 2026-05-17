using EngAce.Domain.Models;
using EngAce.Domain.Models.Enums;
using Microsoft.SemanticKernel;

namespace EngAce.Infrastructure.Extensions;

public static class KernelBuilderExtensions
{
    public static IKernelBuilder AddChatCompletion(this IKernelBuilder builder, AIServiceCredential credential)
    {
        switch (credential.ConnectorType)
        {
            case AiConnectorType.OpenAI:
                builder.AddOpenAIChatCompletion(credential.ModelId, credential.ApiKey);
                break;
            case AiConnectorType.GoogleGemini:
                builder.AddGoogleAIGeminiChatCompletion(credential.ModelId, credential.ApiKey);
                break;
            default:
                throw new NotSupportedException($"Unsupported AI connector type: {credential.ConnectorType}");
        }
        return builder;
    }

}