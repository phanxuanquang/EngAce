namespace Entities
{
    public class SearchResult
    {
        public required string Content { get; set; }
        public List<string>? IpaAudioUrls { get; set; }
    }
}
