using Gemini;

namespace EngAce.Api.DTO
{
    public class GenerateQuizzes
    {
        public string Topics { get; set; } = "Hello";
        public bool UseJson { get; set; } = true;
        public double CreativeLevel { get; set; } = 25;
        public EnumModel Model { get; set; } = EnumModel.Gemini_15_Flash;
    }
}
