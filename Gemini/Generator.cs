using Entities;
using Entities.Enums;
using Helper;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;
using static Gemini.DTO.ResponseForOneShot;

namespace Gemini
{
    public static class Generator
    {
        private static readonly HttpClient Client = new HttpClient();

        public static async Task<string> Generate(string apiKey, string query, bool useJson = true, double creativeLevel = 50, GenerativeModel model = GenerativeModel.Gemini_15_Flash)
        {
            Response? responseDTO = null;
            var endpoint = GetUriWithHeadersIfAny(apiKey, model);

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
                responseDTO = JsonConvert.DeserializeObject<Response>(responseData);

                return responseDTO.Candidates[0].Content.Parts[0].Text;
            }
            catch (Exception ex)
            {
                throw new Exception($"Cannot generate content. {ex.Message}\n{JsonConvert.SerializeObject(responseDTO, Formatting.Indented)}");
            }
        }

        public static async Task<string> Generate(string apiKey, Chat chat)
        {
            var model = GenerativeModel.Gemini_15_Flash;

            var modelName = GeneralHelper.GetEnumDescription(model);
            var endpoint = GetUriWithHeadersIfAny(apiKey, model);

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

        private static string GetUriWithHeadersIfAny(string accessKey, GenerativeModel model)
        {
            var modelName = GeneralHelper.GetEnumDescription(model);
            var uriBuilder = new UriBuilder($"https://generativelanguage.googleapis.com/v1beta/models/{modelName}:generateContent");

            if (accessKey.StartsWith("AIza"))
            {
                var query = System.Web.HttpUtility.ParseQueryString(uriBuilder.Query);
                query["key"] = accessKey;
                uriBuilder.Query = query.ToString();

                return uriBuilder.ToString();
            }

            Client.DefaultRequestHeaders.Add("x-goog-user-project", "engace-426517");
            Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessKey);

            return uriBuilder.ToString();
        }
    }
}
