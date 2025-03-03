namespace Entities
{
    public class ChatResponse
    {
        public required string MessageInMarkdown { get; set; }
        public List<string> Suggestions { get; set; } = [];
    }
}
