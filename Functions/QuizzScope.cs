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

            promptBuilder.AppendLine($"Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm và bạn đang giảng dạy tại Việt Nam. Tôi là một người đang học tiếng Anh, trình độ hiện tại của tôi là {userLevel}. ");
            promptBuilder.Append($"Bây giờ, tôi cần một bộ đề trắc nghiệm tiếng Anh bao gồm {questionsCount} câu hỏi liên quan đến chủ đề '{topic}' để luyện tập. ");
            promptBuilder.AppendLine($"Bộ đề trắc nghiệm mà bạn cung cấp phải có đầy đủ các dạng câu hỏi bao gồm: {types}. ");
            promptBuilder.Append("Nội dung câu hỏi phải thật thú vị để kích thích và tạo cảm hứng cho người học. Mỗi câu hỏi trong bộ đề trắc nghiệm chỉ được phép có 4 lựa chọn. ");
            promptBuilder.Append("Bộ câu hỏi trắc nghiệm của bạn là một mảng JSON tương ứng với class sau: ");
            promptBuilder.AppendLine("class Quiz");
            promptBuilder.AppendLine("{");
            promptBuilder.AppendLine("    string Question; // Nội dung câu hỏi bằng tiếng Anh");
            promptBuilder.AppendLine("    List<string> Options; // 4 lựa chọn cho người dùng chọn");
            promptBuilder.AppendLine("    short RightOptionIndex; // Index của lựa chọn đúng trong mảng Options");
            promptBuilder.AppendLine("    string ExplanationInVietnamese; // Lời giải thích một cách dễ hiểu");
            promptBuilder.AppendLine("}");

            try
            {
                Terminal.Println("--------------------------------------------", ConsoleColor.White);
                Terminal.Println("Generate Quizz:", ConsoleColor.Cyan);
                Terminal.Println($"- Topic: {topic}", ConsoleColor.DarkCyan);
                Terminal.Println($"- English level: {level.ToString()}", ConsoleColor.DarkCyan);
                Terminal.Println($"- Quizz types: {string.Join(", ", quizzTypes.Select(type => type.ToString()))}", ConsoleColor.DarkCyan);
                Terminal.Println($"- Total questions: {questionsCount}", ConsoleColor.DarkCyan);

                var response = await Gemini.Helper.GenerateContent(apiKey, promptBuilder.ToString(), true, 75, model);
                var quizzes = JsonConvert.DeserializeObject<List<Quizz>>(response);

                Terminal.Println(JsonConvert.SerializeObject(quizzes, Formatting.Indented));

                return quizzes;
            }
            catch (Exception ex)
            {
                Terminal.Println(ex.Message, ConsoleColor.Red);
                throw new Exception($"Cannot generate quizz. {ex.Message}");
            }
        }

        public static async Task<List<string>> SuggestTopcis(string apiKey, EnglishLevel level)
        {
            var promptBuilder = new StringBuilder();
            var userLevel = EnumHelper.GetEnumDescription(level);

            promptBuilder.AppendLine($"Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm và bạn đang giảng dạy tại Việt Nam. Tôi là một người đang học tiếng Anh, trình độ hiện tại của tôi là {userLevel}.");
            promptBuilder.Append($"Tôi đang tìm kiếm những chủ đề thú vị để luyện tập tiếng Anh phù hợp với trình độ hiện tại của bản thân, đồng thời cũng muốn có thêm hứng thú để học tập.");
            promptBuilder.AppendLine("Hãy đề xuất cho tôi khoảng 20 đến 40 chủ đề ngắn mà bạn cảm thấy phù hợp nhất và thú vị nhất.");
            promptBuilder.Append("Danh sách chủ đề mà bạn đề xuất phải là một mảng đối lượng JSON tương ứng với kiểu dữ liệu List<string> trong ngôn ngữ C#.");

            try
            {
                Terminal.Println("--------------------------------------------", ConsoleColor.White);
                Terminal.Println("Suggest Topcis:", ConsoleColor.Cyan);
                Terminal.Println($"- English level: {level.ToString()}", ConsoleColor.DarkCyan);

                var response = await Gemini.Helper.GenerateContent(apiKey, promptBuilder.ToString(), true, 100);
                var topics = JsonConvert.DeserializeObject<List<string>>(response);

                Terminal.Println(string.Join("\n", topics));

                var random = new Random();
                return topics.OrderBy(topic => random.Next()).Take(10).ToList();
            }
            catch (Exception ex)
            {
                Terminal.Println(ex.Message, ConsoleColor.Red);
                throw new Exception($"Cannot generate quizz. {ex.Message}");
            }
        }
    }
}
