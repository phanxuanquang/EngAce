using Entities;
using Entities.Enums;
using Helper;
using Newtonsoft.Json;

namespace Functions
{
    public static class QuizzScope
    {
        public static async Task<List<Quizz>> GenerateQuizes(string apiKey, string topic, List<QuizzType> quizzTypes, Level level, short questionsCount)
        {
            var userLevel = EnumHelper.GetEnumDescription(level);
            var types = string.Join(", ", quizzTypes.Select(type => EnumHelper.GetEnumDescription(type)).ToList());
            var model = questionsCount <= 10 ? GenerativeModel.Gemini_15_Flash : GenerativeModel.Gemini_15_Pro;

            var prompt = $@"Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm và bạn đang giảng dạy tại Việt Nam. Tôi là một người đang học tiếng Anh, trình độ hiện tại của tôi là {userLevel}. Bây giờ, tôi cần {questionsCount} câu hỏi trắc nghiệm tiếng Anh liên quan đến chủ đề {topic} để luyện tập. Những câu trắc nghiệm mà bạn cung cấp phải bao gồm các dạng câu hỏi: {types}. Với mỗi câu hỏi chỉ được phép có 4 lựa chọn. Danh sách câu hỏi trắc nghiệm của bạn là một mảng JSON tương ứng với class sau:";
            var jsonStructure = @"class Quiz
            {
                string question; // Nội dung câu hỏi bằng tiếng Anh
                List<string> options; // 4 lựa chọn cho người dùng chọn
                short rightOptionIndex; // Index của lựa chọn đúng trong mảng options
                string explanationInVietnamese; // Lời giải thích bằng tiếng Việt thật dễ hiểu
            }";

            try
            {
                var apiResponse = await Gemini.Helper.GenerateContent(apiKey, $"{prompt} \n {jsonStructure}", true, 30, model);
                return JsonConvert.DeserializeObject<List<Quizz>>(apiResponse);
            }
            catch (Exception ex)
            {
                throw new Exception($"Cannot generate quizz. {ex.Message}");
            }
        }
    }
}
