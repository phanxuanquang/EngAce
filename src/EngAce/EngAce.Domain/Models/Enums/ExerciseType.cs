using System.Text.Json.Serialization;

namespace EngAce.Domain.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ExerciseType : sbyte
{
    FillInTheBlank,
    MultipleChoice,
    Matching,
    TrueFalse,
    ShortAnswer,
}