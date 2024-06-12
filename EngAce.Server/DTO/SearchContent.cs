namespace EngAce.Server.DTO
{
    public class SearchContent
    {
        public required string Keyword { get; set; }
        public string Context { get; set; }
        public required string ApiKey { get; set; }
    }
}
