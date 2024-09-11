using System.ComponentModel;

namespace Entities.Enums
{
    public enum QuizzType
    {
        [Description("Từ vựng (Vocabulary)")]
        Vocabulary = 1,

        [Description("Ngữ pháp (Grammar)")]
        Grammar = 2,

        [Description("Từ đồng nghĩa/trái nghĩa (Synonym/Antonym)")]
        SynonymAndAntonym = 3,

        [Description("Xác định lỗi sai (Error Identification)")]
        ErrorIdentification = 4,

        [Description("Điền vào chỗ trống (Sentence Completion)")]
        FillTheBlank = 5,

        [Description("Đọc hiểu văn bản (Reading Comprehension)")]
        ReadingComprehension = 6,

        [Description("Chuyển đổi từ loại (Word Formation)")]
        WordFormation = 7,

        [Description("Phối hợp từ (Collocation)")]
        Collocations = 8,

        [Description("Chọn từ thích hợp nhất (Word Choice)")]
        WordChoice = 9,

        [Description("Chia động từ (Verb Conjugation)")]
        VerbConjugation = 10,

        [Description("Câu điều kiện (Conditional Sentences)")]
        ConditionalSentences = 11,

        [Description("Câu gián tiếp (Indirect Speech)")]
        IndirectSpeech = 12
    }
}