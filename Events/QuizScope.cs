using Entities;
using Entities.Enums;
using Gemini;
using Helper;
using Newtonsoft.Json;
using System.Text;

namespace Events
{
    public static class QuizScope
    {
        public const sbyte MaxTotalWordsOfTopic = 10;
        public const sbyte MinTotalQuestions = 10;
        public const sbyte MaxTotalQuestions = 100;
        public const int OneMonthAsCachingAge = 2592000;
        public const int OneHourAsCachingAge = 3600;

        public static async Task<List<Quiz>> GenerateQuizes(string apiKey, string topic, List<QuizzType> quizzTypes, EnglishLevel level, short questionsCount)
        {
            var quizes = new List<Quiz>();
            var quizTypeQuestionCount = GeneralHelper.GenerateRandomNumbers(quizzTypes.Count, questionsCount);

            var tasks = new List<Task<List<Quiz>?>>();

            for (int i = 0; i < quizTypeQuestionCount.Count; i++)
            {
                tasks.Add(GenerateQuizesByType(apiKey, topic, (QuizzType)(i + 1), level, quizTypeQuestionCount[i]));
            }

            var results = await Task.WhenAll(tasks);

            foreach (var result in results)
            {
                if (result != null && result.Count != 0)
                {
                    quizes.AddRange(result);
                }
            }

            return quizes
                .AsParallel()
                .OrderBy(x => Guid.NewGuid())
                .Take(questionsCount)
                .ToList();
        }

        private static async Task<List<Quiz>> GenerateQuizesByType(string apiKey, string topic, QuizzType quizzType, EnglishLevel level, int questionsCount)
        {
            try
            {
                var promptBuilder = new StringBuilder();
                var userLevel = GeneralHelper.GetEnumDescription(level);
                var type = GeneralHelper.GetEnumDescription(quizzType);

                promptBuilder.AppendLine($"Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm. Tôi là người đang học tiếng Anh, trình độ tiếng Anh của tôi theo tiêu chuẩn CEFR là {userLevel}. ");
                promptBuilder.Append($"Hãy cho tôi một bộ câu hỏi trắc nghiệm tiếng Anh bao gồm ít nhất {questionsCount} câu hỏi liên quan đến chủ đề '{topic.Trim()}' để luyện tập. ");
                promptBuilder.Append("Nội dung câu hỏi không được vượt quá trình độ tiếng Anh của tôi. ");
                promptBuilder.Append($"Bạn phải đảm bảo mỗi câu hỏi trong bộ đề trắc nghiệm chỉ được phép có 4 lựa chọn với duy nhất 1 lựa chọn đúng, và bộ câu hỏi trắc nghiệm phải thuộc loại câu hỏi: {type}");
                promptBuilder.AppendLine("Output là một mảng JSON tương ứng với class C# sau: ");
                promptBuilder.AppendLine("class Quiz");
                promptBuilder.AppendLine("{");
                promptBuilder.AppendLine("    string Question; // Nội dung câu hỏi bằng tiếng Anh, hãy chắc chắn rằng nó phù hợp với trình độ của tôi");
                promptBuilder.AppendLine("    List<string> Options; // 4 lựa chọn cho người dùng chọn, hãy chắc chắn rẳng nội dung của các lựa chọn không được trùng nhau, và chỉ có duy nhất 1 lựa chọn đúng");
                promptBuilder.AppendLine("    int RightOptionIndex; // Index của lựa chọn đúng trong mảng Options, bạn phải đảm bảo rằng đây là index của lựa chọn chính xác và hợp lý nhất cho câu hỏi (index có giá trị tối thiểu là 0 và giá trị tối đa là 3");
                promptBuilder.AppendLine("    string ExplanationInVietnamese; // Lời giải thích một cách dễ hiểu và hợp lý, phù hợp với trình độ tiếng Anh của tôi");
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
                promptBuilder.AppendLine("Nếu chủ đề được input một thứ vô nghĩa hoặc không thể khác định hoặc không thể hiểu được, hãy trả về một mảng rỗng.");

                var response = await Generator.GenerateContent(apiKey, promptBuilder.ToString(), true, 50, GenerativeModel.Gemini_15_Flash);
                return JsonConvert.DeserializeObject<List<Quiz>>(response).ToList();
            }
            catch
            {
                return new List<Quiz>();
            }
        }
        public static async Task<List<string>> SuggestTopcis(string apiKey, EnglishLevel level)
        {
            var promptBuilder = new StringBuilder();
            var userLevel = GeneralHelper.GetEnumDescription(level);

            promptBuilder.AppendLine($"Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm và bạn đang giảng dạy tại Việt Nam. Trình độ tiếng Anh của tôi theo tiêu chuẩn CEFR là {userLevel}.");
            promptBuilder.Append($"Tôi đang tìm kiếm những chủ đề thú vị để luyện tập tiếng Anh phù hợp với trình độ hiện tại của bản thân, đồng thời cũng muốn có thêm hứng thú để học tập.");
            promptBuilder.AppendLine("Hãy đề xuất cho tôi ít nhất 40 topic ngắn bằng tiếng Anh mà bạn cảm thấy phù hợp nhất và thú vị nhất để luyện tập tiếng Anh.");
            promptBuilder.Append("Danh sách chủ đề mà bạn đề xuất phải là một mảng đối lượng JSON tương ứng với kiểu dữ liệu List<string> của ngôn ngữ lập trình C#.");

            var response = await Gemini.Generator.GenerateContent(apiKey, promptBuilder.ToString(), true, 75);
            return JsonConvert.DeserializeObject<List<string>>(response);
        }
    }
}
