using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EngAce.Domain.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ExerciseType : sbyte
{
    [Display(Name = "Điền vào chỗ trống")]
    FillInTheBlank = 1,

    [Display(Name = "Trắc nghiệm")]
    MultipleChoice,

    [Display(Name = "Ghép nối")]
    Matching,

    [Display(Name = "Đúng/Sai")]
    TrueFalse,

    [Display(Name = "Trả lời ngắn")]
    ShortAnswer,
}