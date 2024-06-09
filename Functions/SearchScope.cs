using Entities;

namespace Functions
{
    public static class SearchScope
    {
        public static async Task<string> Search(string apiKey, string keyword, string context)
        {
            var prompt = $@"Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm và cũng là một nhà nghiên cứu chuyên sâu về ngôn ngữ tiếng Anh. Hãy giải thích một cách thật dễ hiểu nghĩa của '{keyword}', ";
            if (!string.IsNullOrEmpty(context))
            {
                prompt += $"biết rằng ngữ cảnh là '{context}', ";
            }
            prompt += "cách trình bày giải thích của bạn nên giống trang web Oxford Dictionary hoặc Cambridge Dictionary và bạn phải sử dụng tiếng Việt để giải thích để người Việt đọc.";

            try
            {
                var result = await Gemini.Helper.GenerateContent(apiKey, prompt, false, 30, EnumModel.Gemini_15_Flash);
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception($"Cannot find the explanation. {ex.Message}");
            }
        }
    }
}
