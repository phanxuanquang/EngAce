namespace Entities
{
    public class Chat
    {
        public List<History> ChatHistory { get; set; } = new List<History>();
        public string Question { get; set; }

        public class History
        {
            public bool FromUser { get; set; }
            public string Message { get; set; }
        }
    }
}
