using Newtonsoft.Json;

namespace Gemini.DTO
{
    public class ChatRequest
    {
        public class Content
        {
            [JsonProperty("role")]
            public string Role;

            [JsonProperty("parts")]
            public List<Part> Parts;
        }

        public class Part
        {
            [JsonProperty("text")]
            public string Text;
        }

        public class Request
        {
            [JsonProperty("contents")]
            public List<Content> Contents;
        }
    }
}
