using Entities;
using Entities.Enums;
using Helper;
using Newtonsoft.Json;
using System.Text;
using static Gemini.DTO.ResponseForOneShot;

namespace Gemini
{
    public static class Generator
    {
        private static readonly HttpClient Client = new HttpClient();
        private static string ApiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");

        public static async Task<string> Generate(string apiKey, string query, bool useJson = true, double creativeLevel = 50, GenerativeModel model = GenerativeModel.Gemini_15_Flash)
        {
            ApiKey = apiKey.StartsWith("AIza") ? apiKey : ApiKey;

            var modelName = EnumHelper.GetEnumDescription(model);
            var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/{modelName}:generateContent?key={ApiKey}";

            var requestData = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new
                            {
                                text = query
                            }
                        }
                    }
                },
                safetySettings = new[]
                {
                    new
                    {
                        category = "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold = "BLOCK_ONLY_HIGH"
                    }
                },
                generationConfig = new
                {
                    temperature = creativeLevel / 100,
                    topP = 0.8,
                    topK = 10,
                    responseMimeType = useJson ? "application/json" : "text/plain"
                }
            };

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");
                var response = await Client.PostAsync(endpoint, content).ConfigureAwait(false);
                response.EnsureSuccessStatusCode();

                var responseData = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                var dto = JsonConvert.DeserializeObject<Response>(responseData);

                return dto.Candidates[0].Content.Parts[0].Text;
            }
            catch (Exception ex)
            {
                Terminal.Println(ex.Message, ConsoleColor.Red);
                return $"Cannot generate content. {ex.Message}";
            }
        }

        public static async Task<string> Generate(string apiKey, Chat chat)
        {
            ApiKey = apiKey.StartsWith("AIza") ? apiKey : ApiKey;

            var modelName = EnumHelper.GetEnumDescription(GenerativeModel.Gemini_15_Flash);
            var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/{modelName}:generateContent?key={ApiKey}";

            var requestData = string.Empty; // TBD

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");
                var response = await Client.PostAsync(endpoint, content).ConfigureAwait(false);
                response.EnsureSuccessStatusCode();

                var responseData = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                var dto = JsonConvert.DeserializeObject<Response>(responseData);

                return dto.Candidates[0].Content.Parts[0].Text;
            }
            catch (Exception ex)
            {
                Terminal.Println(ex.Message, ConsoleColor.Red);
                return $"Cannot generate content. {ex.Message}";
            }
        }
    }
}
