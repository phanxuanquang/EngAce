using Gemini.DTO;
using Helper;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace Gemini
{
    public static class Generator
    {
        private static readonly HttpClient Client = new();

        public static async Task<string> GenerateContent(string apiKey, string? instruction, string query, bool useJson = true, double creativeLevel = 50, GenerativeModel model = GenerativeModel.Gemini_20_Flash)
        {
            var endpoint = GetUriWithHeadersIfAny(apiKey, model);

            var request = new
            {
                systemInstruction = new
                {
                    parts = new[]
                    {
                        new
                        {
                            text = instruction,
                        }
                    }
                },
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
                        threshold = "BLOCK_NONE"
                    },
                    new
                    {
                        category = "HARM_CATEGORY_HARASSMENT",
                        threshold = "BLOCK_NONE"
                    },
                    new
                    {
                        category = "HARM_CATEGORY_HATE_SPEECH",
                        threshold = "BLOCK_NONE"
                    },
                    new
                    {
                        category = "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold = "BLOCK_NONE"
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

            var body = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");
            var response = await Client.PostAsync(endpoint, body).ConfigureAwait(false);
            response.EnsureSuccessStatusCode();

            var responseData = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            var responseDTO = JsonConvert.DeserializeObject<ResponseForOneShot.Response>(responseData);

            return responseDTO.Candidates[0].Content.Parts[0].Text;
        }

        public static async Task<string> GenerateResponseForConversation(string apiKey, ChatRequest.Request requestData)
        {
            var endpoint = GetUriWithHeadersIfAny(apiKey, GenerativeModel.Gemini_20_Flash_Lite);

            var body = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");
            var response = await Client.PostAsync(endpoint, body);
            response.EnsureSuccessStatusCode();

            var responseData = await response.Content.ReadAsStringAsync();
            var dto = JsonConvert.DeserializeObject<ResponseForConversation.Response>(responseData);

            return dto.Candidates[0].Content.Parts[0].Text;
        }

        private static string GetUriWithHeadersIfAny(string accessKey, GenerativeModel model)
        {
            var modelName = GeneralHelper.GetEnumDescription(model);
            var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/{modelName}:generateContent";

            Client.DefaultRequestHeaders.Clear();

            if (accessKey.StartsWith("AIza"))
            {
                endpoint += $"?key={accessKey}";
                return endpoint;
            }

            Client.DefaultRequestHeaders.Add("project-name-here", "project-id-here");
            Client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessKey);

            return endpoint;
        }
    }
}