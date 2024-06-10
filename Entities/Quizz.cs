namespace Entities
{
    public class Quizz
    {
        public required string question { get; set; }
        public required List<string> options { get; set; }
        public required short rightOptionIndex { get; set; }
        public required string explanationInVietnamese { get; set; }
    }
}
