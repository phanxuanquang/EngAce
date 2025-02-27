using System.ComponentModel;

namespace Entities.Enums
{
    public enum AssignmentType
    {
        [Name("Chọn từ thích hợp nhất"), Description("Most Suitable Word: Chọn từ thích hợp nhất")]
        WordChoice = 1,

        [Name("Chia động từ"), Description("Verb Conjugation: Chia động từ")]
        VerbConjugation = 2,

        [Name("Câu điều kiện"), Description("Conditional Sentences: Câu điều kiện")]
        ConditionalSentences = 3,

        [Name("Câu gián tiếp"), Description("Indirect Speech: Câu gián tiếp")]
        IndirectSpeech = 4,

        [Name("Điền vào chỗ trống"), Description("Sentence Completion: Điền vào chỗ trống")]
        FillTheBlank = 5,

        [Name("Đọc hiểu văn bản"), Description("Reading Comprehension: Đọc hiểu văn bản")]
        ReadingComprehension = 6,

        [Name("Ngữ pháp"), Description("Grammar: Ngữ pháp")]
        Grammar = 7,

        [Name("Phối hợp từ"), Description("Collocation: Phối hợp từ")]
        Collocations = 8,

        [Name("Từ đồng nghĩa/trái nghĩa"), Description("Synonym/Antonym: Từ đồng nghĩa/trái nghĩa")]
        SynonymAndAntonym = 9,

        [Name("Từ vựng"), Description("Vocabulary: Từ vựng")]
        Vocabulary = 10,

        [Name("Xác định lỗi sai"), Description("Error Identification: Xác định lỗi sai")]
        ErrorIdentification = 11,

        [Name("Chuyển đổi từ loại"), Description("Word Formation: Chuyển đổi từ loại")]
        WordFormation = 12,

        [Name("Câu bị động"), Description("Passive Voice: Câu bị động")]
        PassiveVoice = 13,

        [Name("Mệnh đề quan hệ"), Description("Relative Clauses: Mệnh đề quan hệ")]
        RelativeClauses = 14,

        [Name("Câu so sánh"), Description("Comparison Sentences: Câu so sánh")]
        ComparisonSentences = 15,

        [Name("Câu đảo ngữ"), Description("Inversion: Câu đảo ngữ")]
        Inversion = 16,

        [Name("Mạo từ"), Description("Articles: Mạo từ")]
        Articles = 17,

        [Name("Giới từ"), Description("Prepositions: Giới từ")]
        Prepositions = 18,

        [Name("Thành ngữ"), Description("Idioms: Thành ngữ")]
        Idioms = 19,

        [Name("Câu đồng nghĩa"), Description("Sentence Transformation: Câu đồng nghĩa")]
        SentenceTransformation = 20,

        [Name("Trọng âm và phát âm"), Description("Pronunciation & Stress: Trọng âm và phát âm")]
        PronunciationAndStress = 21,

        [Name("Đọc điền từ"), Description("Cloze Test: Đọc điền từ")]
        ClozeTest = 22,

        [Name("Nối câu"), Description("Sentence Combination: Nối câu")]
        SentenceCombination = 23,

        [Name("Chọn tiêu đề phù hợp"), Description("Matching Headings: Chọn tiêu đề phù hợp")]
        MatchingHeadings = 24,

        [Name("Hoàn thành đoạn hội thoại"), Description("Dialogue Completion: Hoàn thành đoạn hội thoại")]
        DialogueCompletion = 25,

        [Name("Sắp xếp câu"), Description("Sentence Ordering: Sắp xếp câu")]
        SentenceOrdering = 26,

        [Name("Tìm nghĩa của từ trong ngữ cảnh"), Description("Word Meaning in Context: Tìm nghĩa của từ trong ngữ cảnh")]
        WordMeaningInContext = 27
    }
}
