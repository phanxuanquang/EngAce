using Gemini.NET;

namespace Events
{
    public static class HealthcheckScope
    {
        public static async Task<bool> Healthcheck(string apiKey)
        {
            var generator = new Generator(apiKey);

            return await generator.IsValidApiKeyAsync();
        }
    }
}
