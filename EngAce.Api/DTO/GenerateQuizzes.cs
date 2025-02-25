using Entities.Enums;

namespace EngAce.Api.DTO
{
    public class GenerateQuizzes
    {
        public required string Topic { get; set; }
        public required List<AssignmentType> AssignmentTypes { get; set; }
        public required EnglishLevel EnglishLevel { get; set; }
        public required sbyte TotalQuestions { get; set; }
    }
}
