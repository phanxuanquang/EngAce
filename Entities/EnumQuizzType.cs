using System.ComponentModel;

namespace Entities
{
    public enum EnumQuizzType
    {
        [Description("Câu hỏi dạng chọn câu đúng (Sentence Correction Questions)")]
        SentenceCorrection = 1,

        [Description("Câu hỏi điền từ vào chỗ trống (Fill-in-the-Blank Questions)")]
        FillTheBlank = 2,

        [Description("Câu hỏi về đọc hiểu (Reading Comprehension Questions)")]
        ReadingComprehension = 3,

        [Description("Câu hỏi về từ đồng nghĩa và trái nghĩa (Synonym and Antonym Questions)")]
        SynonymAndAntonym = 4,

        [Description("Câu hỏi về chức năng ngôn ngữ (Functional Language Questions)")]
        FunctionalLanguage = 5,

        [Description("Câu hỏi về từ vựng (Vocabulary Questions)")]
        Vocabulary = 6,

        [Description("Câu hỏi về ngữ pháp (Grammar Questions)")]
        Grammar = 7,
    }
}
