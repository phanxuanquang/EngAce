using Entities;
using Entities.Enums;
using Helper;
using Newtonsoft.Json;
using System.Text;

namespace Functions
{
    public static class QuizzScope
    {
        public static async Task<List<Quizz>?> GenerateQuizes(string apiKey, string topic, List<QuizzType> quizzTypes, EnglishLevel level, short questionsCount)
        {
            var promptBuilder = new StringBuilder();
            var userLevel = EnumHelper.GetEnumDescription(level);
            var types = string.Join(", ", quizzTypes.Select(type => EnumHelper.GetEnumDescription(type)).ToList());
            var model = questionsCount <= 10 ? GenerativeModel.Gemini_15_Flash : GenerativeModel.Gemini_15_Pro;

            promptBuilder.AppendLine($"Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm và bạn đang giảng dạy tại Việt Nam. Tôi là một người đang học tiếng Anh, trình độ hiện tại của tôi là {userLevel}.");
            promptBuilder.Append($"Bây giờ, tôi cần một bộ đề trắc nghiệm tiếng Anh bao gồm {questionsCount} câu hỏi liên quan đến chủ đề '{topic}' để luyện tập.");
            promptBuilder.AppendLine($"Những câu trắc nghiệm mà bạn cung cấp phải bao gồm dạng câu hỏi: {types}.");
            promptBuilder.Append("Mỗi câu hỏi trong bộ đề trắc nghiệm chỉ được phép có 4 lựa chọn.");
            promptBuilder.Append("Bộ câu hỏi trắc nghiệm của bạn là một mảng JSON tương ứng với class sau:");
            promptBuilder.AppendLine("class Quiz");
            promptBuilder.AppendLine("{");
            promptBuilder.AppendLine("    string question; // Nội dung câu hỏi bằng tiếng Anh");
            promptBuilder.AppendLine("    List<string> options; // 4 lựa chọn cho người dùng chọn");
            promptBuilder.AppendLine("    short rightOptionIndex; // Index của lựa chọn đúng trong mảng options");
            promptBuilder.AppendLine("    string explanationInVietnamese; // Lời giải thích bằng thật dễ hiểu");
            promptBuilder.AppendLine("}");

            try
            {
                var response = await Gemini.Helper.GenerateContent(apiKey, promptBuilder.ToString(), true, 30, model);
                return JsonConvert.DeserializeObject<List<Quizz>>(response);
            }
            catch (Exception ex)
            {
                throw new Exception($"Cannot generate quizz. {ex.Message}");
            }
        }
    }
}
