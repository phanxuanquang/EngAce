namespace Entities
{
    public class Quiz
    {
        public required string Question { get; set; }
        public required List<string> Options { get; set; }
        public required sbyte RightOptionIndex { get; set; }
        public required string ExplanationInVietnamese { get; set; }
    }
}
