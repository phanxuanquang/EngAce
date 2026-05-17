#pragma warning disable SKEXP0070

using Microsoft.Extensions.DependencyInjection;

namespace EngAce.Infrastructure;

public static class DependencyInjection
{
    /// <summary>
    /// Registers infrastructure services into the dependency injection container.
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        return services;
    }
}
