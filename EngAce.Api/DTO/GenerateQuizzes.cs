using Entities;

namespace EngAce.Api.DTO
{
    public class GenerateQuizzes
    {
        public required string Topic { get; set; }
        public required List<EnumQuizzType> QuizzTypes { get; set; }
        public required string ApiKey { get; set; }
    }
}
