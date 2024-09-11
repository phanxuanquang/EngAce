using System.ComponentModel;

namespace Entities.Enums
{
    public enum QuizzType
    {
        [Description("Chọn từ thích hợp nhất (Most Suitable Word)")]
        WordChoice = 1,

        [Description("Chia động từ (Verb Conjugation)")]
        VerbConjugation = 2,

        [Description("Câu điều kiện (Conditional Sentences)")]
        ConditionalSentences = 3,

        [Description("Câu gián tiếp (Indirect Speech)")]
        IndirectSpeech = 4,

        [Description("Điền vào chỗ trống (Sentence Completion)")]
        FillTheBlank = 5,

        [Description("Đọc hiểu văn bản (Reading Comprehension)")]
        ReadingComprehension = 6,

        [Description("Ngữ pháp (Grammar)")]
        Grammar = 7,

        [Description("Phối hợp từ (Collocation)")]
        Collocations = 8,

        [Description("Từ đồng nghĩa/trái nghĩa (Synonym/Antonym)")]
        SynonymAndAntonym = 9,

        [Description("Từ vựng (Vocabulary)")]
        Vocabulary = 10,

        [Description("Xác định lỗi sai (Error Identification)")]
        ErrorIdentification = 11,

        [Description("Chuyển đổi từ loại (Word Formation)")]
        WordFormation = 12
    }

}