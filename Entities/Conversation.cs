namespace Entities
{
    public class Conversation
    {
        public List<History> ChatHistory { get; set; } = [];
        public required string Question { get; set; }

        public class History
        {
            public bool FromUser { get; set; }
            public required string Message { get; set; }
        }
    }
}
