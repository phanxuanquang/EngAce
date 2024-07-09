using System.Text;

namespace Events
{
    public static class SearchScope
    {
        public static async Task<string> Search(string apiKey, bool useEnglish, string keyword, string context)
        {
            var promptBuilder = new StringBuilder();

            if (useEnglish)
            {
                promptBuilder.Append("You are an English teacher with over 20 years of experience and also an in-depth researcher of the English language.");
                promptBuilder.Append($"Please explain the meaning of '{keyword}'");
                if (!string.IsNullOrEmpty(context))
                {
                    promptBuilder.Append($" in the context '{context}' ");
                }
                promptBuilder.Append("\nYour explanation format should be similar to the Oxford Dictionary or Cambridge Dictionary website, and it must be easy for even intermediate English learners to understand. You can also provide some examples for further clarification.");
            }
            else
            {
                promptBuilder.Append("Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm và cũng là một nhà nghiên cứu chuyên sâu về ngôn ngữ tiếng Anh.");
                promptBuilder.Append($"Hãy giải thích một cách thật dễ hiểu nghĩa của '{keyword}'");
                if (!string.IsNullOrEmpty(context))
                {
                    promptBuilder.Append($" trong ngữ cảnh '{context}' ");
                }
                promptBuilder.Append("\nCách trình bày giải thích của bạn nên giống trang web Oxford Dictionary hoặc Cambridge Dictionary, và bạn phải sử dụng tiếng Việt để giải thích vì người đọc chính là người Việt Nam. Bạn cũng có thể cung cấp một số ví dụ để làm rõ hơn cách giải thích và cách áp dụng.");
            }

            return await Gemini.Generator.Generate(apiKey, promptBuilder.ToString(), false);
        }
    }
}
