
namespace EngAce.Api;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddHttpContextAccessor();

        builder.Services.AddControllers();
        builder.Services.AddOpenApi();

        var app = builder.Build();

        app.MapOpenApi();

        app.UseHttpsRedirection();
        app.UseAuthorization();

        app.MapControllers();

        await app.RunAsync();
    }
}