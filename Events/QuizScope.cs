using Entities;
using Entities.Enums;
using Helper;
using Newtonsoft.Json;
using System.Text;

namespace Events
{
    public static class QuizScope
    {
        public const int MinTotalQuiz = 5;
        public const int MaxTotalQuiz = 40;
        public static async Task<List<Quiz>?> GenerateQuizes(string apiKey, string topic, List<QuizzType> quizzTypes, EnglishLevel level, short questionsCount)
        {
            var promptBuilder = new StringBuilder();
            var userLevel = GeneralHelper.GetEnumDescription(level);
            var types = string.Join(", ", quizzTypes.Select(type => GeneralHelper.GetEnumDescription(type)).ToList());
            var model = questionsCount <= 10 ? GenerativeModel.Gemini_15_Flash : GenerativeModel.Gemini_15_Pro;

            promptBuilder.AppendLine($"Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm. Trình độ tiếng Anh của tôi theo tiêu chuẩn CEFR là {userLevel}. ");
            promptBuilder.Append($"Hãy cho tôi một bộ câu hỏi trắc nghiệm tiếng Anh bao gồm {questionsCount} câu hỏi liên quan đến chủ đề '{topic}' để luyện tập. ");
            promptBuilder.Append("Nội dung câu hỏi phải thật thú vị để kích thích và tạo cảm hứng cho người học. Mỗi câu hỏi trong bộ đề trắc nghiệm chỉ được phép có 4 lựa chọn. ");
            promptBuilder.AppendLine($"Bộ câu hỏi trắc nghiệm của bạn phải bao gồm các loại câu hỏi: {types}. ");
            promptBuilder.AppendLine("Output là một mảng JSON tương ứng với class C# sau: ");
            promptBuilder.AppendLine("class Quiz");
            promptBuilder.AppendLine("{");
            promptBuilder.AppendLine("    string Question; // Nội dung câu hỏi bằng tiếng Anh");
            promptBuilder.AppendLine("    List<string> Options; // 4 lựa chọn cho người dùng chọn");
            promptBuilder.AppendLine("    int RightOptionIndex; // Index của lựa chọn đúng trong mảng Options");
            promptBuilder.AppendLine("    string ExplanationInVietnamese; // Lời giải thích một cách dễ hiểu, phù hợp với trình độ tiếng Anh của tôi");
            promptBuilder.AppendLine("}");
            promptBuilder.AppendLine("Ví dụ về output mà tôi cần:");
            promptBuilder.AppendLine("[");
            promptBuilder.AppendLine("    {");
            promptBuilder.AppendLine("        \"Question\": \"Nội dung câu hỏi 1\",");
            promptBuilder.AppendLine("        \"Options\": [\"Option1\", \"Option2\", \"Option3\", \"Option4\"],");
            promptBuilder.AppendLine("        \"RightOptionIndex\": 0,");
            promptBuilder.AppendLine("        \"ExplanationInVietnamese\": \"Lời giải thích cho đáp án đúng\"");
            promptBuilder.AppendLine("    },");
            promptBuilder.AppendLine("    {");
            promptBuilder.AppendLine("        \"Question\": \"Nội dung câu hỏi 2\",");
            promptBuilder.AppendLine("        \"Options\": [\"Option1\", \"Option2\", \"Option3\", \"Option4\"],");
            promptBuilder.AppendLine("        \"RightOptionIndex\": 1,");
            promptBuilder.AppendLine("        \"ExplanationInVietnamese\": \"Lời giải thích cho đáp án đúng\"");
            promptBuilder.AppendLine("    }");
            promptBuilder.AppendLine("]");

            var response = await Gemini.Generator.Generate(apiKey, promptBuilder.ToString(), true, 50, model);
            return JsonConvert.DeserializeObject<List<Quiz>>(response);
        }

        public static async Task<List<string>> SuggestTopcis(string apiKey, EnglishLevel level)
        {
            var promptBuilder = new StringBuilder();
            var userLevel = GeneralHelper.GetEnumDescription(level);

            promptBuilder.AppendLine($"Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm và bạn đang giảng dạy tại Việt Nam. Trình độ tiếng Anh của tôi theo tiêu chuẩn CEFR là {userLevel}.");
            promptBuilder.Append($"Tôi đang tìm kiếm những chủ đề thú vị để luyện tập tiếng Anh phù hợp với trình độ hiện tại của bản thân, đồng thời cũng muốn có thêm hứng thú để học tập.");
            promptBuilder.AppendLine("Hãy đề xuất cho tôi ít nhất 100 topic ngắn bằng tiếng Anh mà bạn cảm thấy phù hợp nhất và thú vị nhất để luyện tập tiếng Anh.");
            promptBuilder.Append("Danh sách chủ đề mà bạn đề xuất phải là một mảng đối lượng JSON tương ứng với kiểu dữ liệu List<string> trong ngôn ngữ C#.");

            var response = await Gemini.Generator.Generate(apiKey, promptBuilder.ToString(), true, 100, GenerativeModel.Gemini_15_Pro);
            return JsonConvert.DeserializeObject<List<string>>(response);
        }

        public static async Task<string> GenerateQuizesAsHtml(string apiKey, string topic, List<QuizzType> quizzTypes, EnglishLevel level, short questionsCount)
        {
            var promptBuilder = new StringBuilder();
            var userLevel = GeneralHelper.GetEnumDescription(level);
            var types = string.Join(", ", quizzTypes.Select(type => GeneralHelper.GetEnumDescription(type)).ToList());
            var model = questionsCount <= 10 ? GenerativeModel.Gemini_15_Flash : GenerativeModel.Gemini_15_Pro;

            promptBuilder.AppendLine($"Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm và bạn đang giảng dạy tại Việt Nam. Trình độ tiếng Anh của tôi theo tiêu chuẩn CEFR là {userLevel}. ");
            promptBuilder.Append($"Bây giờ, tôi cần một bộ đề trắc nghiệm tiếng Anh bao gồm {questionsCount} câu hỏi liên quan đến chủ đề '{topic}' để luyện tập. ");
            promptBuilder.AppendLine($"Bộ đề trắc nghiệm mà bạn cung cấp phải có đầy đủ các dạng câu hỏi bao gồm: {types}. ");
            promptBuilder.Append("Nội dung câu hỏi phải thật thú vị để kích thích và tạo cảm hứng cho người học. Mỗi câu hỏi trong bộ đề trắc nghiệm chỉ được phép có 4 lựa chọn. ");
            promptBuilder.Append("Bộ đề trắc nghiệm của bạn phải được trình bày thật rõ ràng và chuyên nghiệp, chỉ được phép chứa danh sách câu hỏi và danh sách đáp án.");

            var response = await Gemini.Generator.Generate(apiKey, promptBuilder.ToString(), false, 75, model);
            return GeneralHelper.AsHtml(response);
        }
    }
}
