using System.ComponentModel;

namespace Entities.Enums
{
    public enum QuizzType
    {
        [Description("Most Suitable Word (Chọn từ thích hợp nhất)")]
        WordChoice = 1,

        [Description("Verb Conjugation (Chia động từ)")]
        VerbConjugation = 2,

        [Description("Conditional Sentences (Câu điều kiện)")]
        ConditionalSentences = 3,

        [Description("Indirect Speech (Câu gián tiếp)")]
        IndirectSpeech = 4,

        [Description("Sentence Completion (Điền vào chỗ trống)")]
        FillTheBlank = 5,

        [Description("Reading Comprehension (Đọc hiểu văn bản)")]
        ReadingComprehension = 6,

        [Description("Grammar (Ngữ pháp)")]
        Grammar = 7,

        [Description("Collocation (Phối hợp từ)")]
        Collocations = 8,

        [Description("Synonym/Antonym (Từ đồng nghĩa/trái nghĩa)")]
        SynonymAndAntonym = 9,

        [Description("Vocabulary (Từ vựng)")]
        Vocabulary = 10,

        [Description("Error Identification (Xác định lỗi sai)")]
        ErrorIdentification = 11,

        [Description("Word Formation (Chuyển đổi từ loại)")]
        WordFormation = 12
    }

}