namespace Entities
{
    public class Comment
    {
        public string GeneralCommentForTheContent { get; set; }
        public string ContentWithHighlightedIssues { get; set; }
        public List<string> HighlightIssues { get; set; }
        public string ImprovedContent { get; set; }
    }
}
