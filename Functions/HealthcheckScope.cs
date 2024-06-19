namespace Functions
{
    public static class HealthcheckScope
    {
        public static async Task<string> Healthcheck(string apiKey)
        {
            var prompt = "Say 'Hello World' to me.";
            try
            {
                return await Gemini.Generator.Generate(apiKey, prompt, false);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
