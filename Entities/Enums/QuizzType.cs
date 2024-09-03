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

        [Description("Chọn ý đúng nhất (Sentence Correction)")]
        SentenceCorrection = 6,

        [Description("Đọc hiểu văn bản (Reading Comprehension)")]
        ReadingComprehension = 7,

        [Description("Chuyển đổi từ loại (Word Formation)")]
        WordFormation = 8,

        [Description("Phối hợp từ (Collocation)")]
        Collocations = 9,
    }
}