using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EngAce.Domain.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum PartOfSpeech : sbyte
{
    [Display(Name = "Danh từ")]
    Noun = 1,

    [Display(Name = "Động từ")]
    Verb,

    [Display(Name = "Tính từ")]
    Adjective,

    [Display(Name = "Trạng từ")]
    Adverb,

    [Display(Name = "Đại từ")]
    Pronoun,

    [Display(Name = "Giới từ")]
    Preposition,

    [Display(Name = "Liên từ")]
    Conjunction,

    [Display(Name = "Thán từ")]
    Interjection,

    [Display(Name = "Động từ khiếm khuyết")]
    ModalVerb,

    [Display(Name = "Trợ động từ")]
    AuxiliaryVerb,

    [Display(Name = "Từ hạn định")]
    Determiner,

    [Display(Name = "Từ lượng từ")]
    Quantifier,

    [Display(Name = "Từ cảm thán")]
    Exclamative,

    [Display(Name = "Từ nối")]
    Particle,

    [Display(Name = "Mạo từ")]
    Article,

    [Display(Name = "Cụm thành ngữ")]
    Idiom
}