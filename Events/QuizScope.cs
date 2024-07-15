using Entities;
using Entities.Enums;
using Helper;
using Newtonsoft.Json;
using System.Text;

namespace Events
{
    public static class QuizScope
    {
        public const sbyte MinTotalQuestions = 10;
        public const sbyte MaxTotalQuestions = 40;
        public static async Task<List<Quiz>?> GenerateQuizes(string apiKey, string topic, List<QuizzType> quizzTypes, EnglishLevel level, short questionsCount)
        {
            var promptBuilder = new StringBuilder();
            var userLevel = GeneralHelper.GetEnumDescription(level);
            var types = string.Join(", ", quizzTypes.Select(type => GeneralHelper.GetEnumDescription(type)).ToList());
            var model = questionsCount <= (MinTotalQuestions * 2) ? GenerativeModel.Gemini_15_Flash : GenerativeModel.Gemini_15_Pro;

            promptBuilder.AppendLine($"Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm. Tôi là người đang học tiếng Anh, trình độ tiếng Anh của tôi theo tiêu chuẩn CEFR là {userLevel}. ");
            promptBuilder.Append($"Hãy cho tôi một bộ câu hỏi trắc nghiệm tiếng Anh bao gồm chính xác {questionsCount} câu hỏi liên quan đến chủ đề '{topic.Trim()}' để luyện tập. ");
            promptBuilder.Append("Nội dung câu hỏi không được vượt quá trình độ tiếng Anh của tôi và trình độ tiếng Anh trung bình của người Việt Nam, và cũng phải thật thú vị để kích thích và tạo cảm hứng cho người học");
            promptBuilder.Append("Nội dung của bộ đề phải là những thông tin chính xác và đã được kiểm chứng, mỗi câu hỏi trong bộ đề trắc nghiệm chỉ được phép có 4 lựa chọn.");
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

            var response = await Gemini.Generator.GenerateContent(apiKey, promptBuilder.ToString(), true, 50, model);
            return JsonConvert.DeserializeObject<List<Quiz>>(response);
        }

        public static async Task<List<string>> SuggestTopcis(string apiKey, EnglishLevel level)
        {
            var promptBuilder = new StringBuilder();
            var userLevel = GeneralHelper.GetEnumDescription(level);

            promptBuilder.AppendLine($"Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm và bạn đang giảng dạy tại Việt Nam. Trình độ tiếng Anh của tôi theo tiêu chuẩn CEFR là {userLevel}.");
            promptBuilder.Append($"Tôi đang tìm kiếm những chủ đề thú vị để luyện tập tiếng Anh phù hợp với trình độ hiện tại của bản thân, đồng thời cũng muốn có thêm hứng thú để học tập.");
            promptBuilder.AppendLine("Hãy đề xuất cho tôi ít nhất 20 topic ngắn gọn bằng tiếng Anh mà bạn cảm thấy phù hợp nhất và thú vị nhất để luyện tập tiếng Anh.");
            promptBuilder.Append("Danh sách chủ đề mà bạn đề xuất phải là một mảng đối lượng JSON tương ứng với kiểu dữ liệu List<string> của ngôn ngữ lập trình C#.");

            var response = await Gemini.Generator.GenerateContent(apiKey, promptBuilder.ToString(), true, 75);
            return JsonConvert.DeserializeObject<List<string>>(response);
        }
    }
}
