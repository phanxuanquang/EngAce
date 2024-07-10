namespace Events
{
    public static class HealthcheckScope
    {
        public static async Task<string> Healthcheck(string apiKey)
        {
            var prompt = "Say 'Hello World' to me!";
            return await Gemini.Generator.Generate(apiKey, prompt, false, 10);
        }
    }
}
