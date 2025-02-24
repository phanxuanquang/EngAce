using System.ComponentModel;

namespace Entities.Enums
{
    public enum AssignmentType
    {
        [Name("Chọn từ thích hợp nhất"), Description("Most Suitable Word (Chọn từ thích hợp nhất)")]
        WordChoice = 1,

        [Name("Chia động từ"), Description("Verb Conjugation (Chia động từ)")]
        VerbConjugation = 2,

        [Name("Câu điều kiện"), Description("Conditional Sentences (Câu điều kiện)")]
        ConditionalSentences = 3,

        [Name("Câu gián tiếp"), Description("Indirect Speech (Câu gián tiếp)")]
        IndirectSpeech = 4,

        [Name("Điền vào chỗ trống"), Description("Sentence Completion (Điền vào chỗ trống)")]
        FillTheBlank = 5,

        [Name("Đọc hiểu văn bản"), Description("Reading Comprehension (Đọc hiểu văn bản)")]
        ReadingComprehension = 6,

        [Name("Ngữ pháp"), Description("Grammar (Ngữ pháp)")]
        Grammar = 7,

        [Name("Phối hợp từ"), Description("Collocation (Phối hợp từ)")]
        Collocations = 8,

        [Name("Từ đồng nghĩa/trái nghĩa"), Description("Synonym/Antonym (Từ đồng nghĩa/trái nghĩa)")]
        SynonymAndAntonym = 9,

        [Name("Từ vựng"), Description("Vocabulary (Từ vựng)")]
        Vocabulary = 10,

        [Name("Xác định lỗi sai"), Description("Error Identification (Xác định lỗi sai)")]
        ErrorIdentification = 11,

        [Name("Chuyển đổi từ loại"), Description("Word Formation (Chuyển đổi từ loại)")]
        WordFormation = 12
    }
}
