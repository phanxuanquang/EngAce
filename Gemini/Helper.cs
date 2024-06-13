using Entities.Enums;
using Helper;
using Newtonsoft.Json;
using System.Text;
using static Gemini.DTO.ResponseForOneShot;

namespace Gemini
{
    public static class Helper
    {
        private static readonly HttpClient _httpClient = new HttpClient();

        /// <summary>
        /// Generate content from the query parameters
        /// </summary>
        /// <param name="apiKey">The API Key of Gemini</param>
        /// <param name="query">The query of the user</param>
        /// <param name="useJson">Use JSON format for the output</param>
        /// <param name="creativeLevel">The creativity of the generative model</param>
        /// <param name="model">The generative model to be used</param>
        /// <returns></returns>
        public static async Task<string> GenerateContent(string apiKey, string query, bool useJson = true, double creativeLevel = 50, GenerativeModel model = GenerativeModel.Gemini_15_Flash)
        {
            apiKey = apiKey.StartsWith("AIza") ? apiKey : Environment.GetEnvironmentVariable("GEMINI_API_KEY");

            var modelName = EnumHelper.GetEnumDescription(model);
            var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/{modelName}:generateContent?key={apiKey}";

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
                var content = JsonConvert.SerializeObject(requestData);

                using (var request = new StringContent(content, Encoding.UTF8, "application/json"))
                {
                    HttpResponseMessage response = await _httpClient.PostAsync(endpoint, request).ConfigureAwait(false);
                    response.EnsureSuccessStatusCode();

                    var responseData = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                    var result = JsonConvert.DeserializeObject<Response>(responseData);

                    return result.Candidates[0].Content.Parts[0].Text;
                }
            }
            catch (Exception ex)
            {
                return $"Cannot generate quizzes. {ex.Message}";
            }
        }
    }
}
