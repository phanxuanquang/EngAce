namespace Entities
{
    public class Conversation
    {
        public List<History> ChatHistory { get; set; } = [];
        public required string Question { get; set; }
        public List<string>? ImagesAsBase64 { get; set; }

        public class History
        {
            public bool FromUser { get; set; }
            public string? Message { get; set; }
        }
    }
}
