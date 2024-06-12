using Entities.Enums;
using System.Text;

namespace Functions
{
    public static class SearchScope
    {
        public static async Task<string> Search(string apiKey, bool useEnglish, string keyword, string context)
        {
            var promptBuilder = new StringBuilder();
            if (useEnglish)
            {
                promptBuilder.Append("You are an English teacher with over 20 years of experience and also an in-depth researcher of the English language.");
                promptBuilder.Append($"Please help me to explain the meaning of '{keyword}'");
                if (!string.IsNullOrEmpty(context))
                {
                    promptBuilder.Append($" knowing the context is '{context}' ");
                }
                promptBuilder.Append("\nYour explanation format should be similar to the Oxford Dictionary or Cambridge Dictionary website, and it must be easy for even intermediate English learners to understand.");
            }
            else
            {
                promptBuilder.Append("Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm và cũng là một nhà nghiên cứu chuyên sâu về ngôn ngữ tiếng Anh.");
                promptBuilder.Append($"Hãy giải thích một cách thật dễ hiểu nghĩa của '{keyword}'");
                if (!string.IsNullOrEmpty(context))
                {
                    promptBuilder.Append($", biết rằng ngữ cảnh là '{context}' ");
                }
                promptBuilder.Append("\nCách trình bày giải thích của bạn nên giống trang web Oxford Dictionary hoặc Cambridge Dictionary, và bạn phải sử dụng tiếng Việt để giải thích vì người đọc chính là người Việt Nam.");
            }

            try
            {
                return await Gemini.Helper.GenerateContent(apiKey, promptBuilder.ToString(), false, 30, GenerativeModel.Gemini_15_Flash);
            }
            catch (Exception ex)
            {
                throw new Exception($"Cannot find the explanation. {ex.Message}");
            }
        }
    }
}
