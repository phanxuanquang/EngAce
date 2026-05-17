using EngAce.Domain.Models;
using EngAce.Domain.Models.Enums;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.Google;
using Microsoft.SemanticKernel.Connectors.OpenAI;

namespace EngAce.Infrastructure.Extensions;

public static class AiServiceProviderExtensions
{
    public static PromptExecutionSettings CreatePromptExecutionSettingsWithFunctionCalling(this AiServiceProvider serviceProvider, double temperature = 1)
    {
        var promptExecutionSettings = new PromptExecutionSettings
        {
            FunctionChoiceBehavior = FunctionChoiceBehavior.Auto(
                options: new FunctionChoiceBehaviorOptions
                {
                    AllowConcurrentInvocation = false,
                    AllowParallelCalls = false,
                },
                autoInvoke: true)
        };

        promptExecutionSettings = serviceProvider switch
        {
            AiServiceProvider.OpenAI => new OpenAIPromptExecutionSettings
            {
                FunctionChoiceBehavior = promptExecutionSettings.FunctionChoiceBehavior,
                Temperature = temperature
            },
            AiServiceProvider.Gemini => new GeminiPromptExecutionSettings
            {
                ToolCallBehavior = GeminiToolCallBehavior.AutoInvokeKernelFunctions,
                FunctionChoiceBehavior = promptExecutionSettings.FunctionChoiceBehavior,
                Temperature = temperature
            },
            _ => throw new NotImplementedException(),
        };

        return promptExecutionSettings!;
    }

    public static PromptExecutionSettings CreatePromptExecutionSettingsForJsonOutput<T>(this AiServiceProvider serviceProvider, double temperature = 1)
    {
        return serviceProvider switch
        {
            AiServiceProvider.OpenAI => new OpenAIPromptExecutionSettings
            {
                Temperature = temperature,
                ResponseFormat = typeof(T)
            },
            AiServiceProvider.Gemini => new GeminiPromptExecutionSettings
            {
                Temperature = temperature,
                ResponseSchema = typeof(T),
                ResponseMimeType = "application/json"
            },
            _ => throw new NotImplementedException($"The service provider {serviceProvider} does not support JSON output format."),
        };
    }

    public static ChatMessageContent CreateChatMessageContent(this AiServiceProvider serviceProvider, ConversationEntry conversationEntry)
    {
        throw new NotImplementedException();
    }

    public static AiServiceProviderConfigurations GetDefaultConfigurations(this AiServiceProvider serviceProvider)
    {
        return serviceProvider switch
        {
            AiServiceProvider.OpenAI => new AiServiceProviderConfigurations
            {
                DefaultModelId = "gpt-4-0613"
            },
            AiServiceProvider.Gemini => new AiServiceProviderConfigurations
            {
                DefaultModelId = "gemini-3.1-flash-lite"
            },
            _ => throw new NotImplementedException($"The service provider {serviceProvider} does not have default configurations.")
        };
    }
}