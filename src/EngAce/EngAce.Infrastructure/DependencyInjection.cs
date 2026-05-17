using EngAce.Domain.Interfaces;
using EngAce.Infrastructure.Implementations;
using Microsoft.Extensions.DependencyInjection;

namespace EngAce.Infrastructure;

public static class DependencyInjection
{
    /// <summary>
    /// Registers infrastructure services into the dependency injection container.
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IDictionaryService, DictionaryService>();
        services.AddScoped<IExerciseService, ExerciseService>();
        services.AddScoped<IWritingService, WritingService>();
        services.AddScoped<IConversationService, ConversationService>();

        return services;
    }
}
