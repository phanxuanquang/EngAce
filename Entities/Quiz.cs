namespace Entities
{
    public class Quiz
    {
        public string question { get; set; }
        public List<string> options { get; set; }
        public short right_answer_index { get; set; }
        public string explanation { get; set; }
    }
}
