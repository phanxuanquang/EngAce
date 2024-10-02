namespace Events
{
    public static class HealthcheckScope
    {
        public static async Task<string> Healthcheck(string apiKey)
        {
            var prompt = "Say 'Hello World' to me!";
            return await Gemini.Generator.GenerateContent(apiKey, "You are my helpful assistant", prompt, false, 10);
        }
    }
}
