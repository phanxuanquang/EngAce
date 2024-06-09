namespace Entities
{
    public class Quiz
    {
        public string question { get; set; }
        public List<string> options { get; set; }
        public short rightOptionIndex { get; set; }
        public string explanationInVietnamese { get; set; }
    }
}
