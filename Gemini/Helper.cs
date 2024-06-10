using Entities.Enums;
using Helper;
using Newtonsoft.Json;
using System.Text;
using static Gemini.DTO.ResponseForOneShot;

namespace Gemini
{
    public static class Helper
    {
        public static async Task<string> GenerateContent(string apiKey, string input, bool useJson = true, double creativeLevel = 25, GenerativeModel model = GenerativeModel.Gemini_10_Pro)
        {
            var client = new HttpClient();
            var modelName = EnumHelper.GetEnumDescription(model);
            var apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/{modelName}:generateContent?key={apiKey}";

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
                                text = input
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
                    temperature = (double)creativeLevel / 100,
                    topP = 0.8,
                    topK = 10,
                    responseMimeType = useJson ? "application/json" : "text/plain"
                }
            };

            try
            {
                var jsonContent = JsonConvert.SerializeObject(requestData);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                response.EnsureSuccessStatusCode();

                var responseData = await response.Content.ReadAsStringAsync();
                var dto = JsonConvert.DeserializeObject<Response>(responseData);

                return dto.Candidates[0].Content.Parts[0].Text;
            }
            catch (HttpRequestException e)
            {
                return $"Request error: {requestData}\n{e.Message}";
            }
        }
    }
}
