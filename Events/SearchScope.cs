using System.Text;

namespace Events
{
    public static class SearchScope
    {
        public const sbyte MaxKeywordTotalWords = 7;
        public const sbyte MaxContextTotalWords = 15;
        public static async Task<string> Search(string apiKey, bool useEnglish, string keyword, string context)
        {
            var promptBuilder = new StringBuilder();
            keyword = keyword.Trim();
            context = context.Trim();

            if (useEnglish)
            {
                promptBuilder.Append("You are a highly advanced English-Vietnamese dictionary that applies AI technology for lookup tasks. Your job is to help me explain English words.");
                promptBuilder.AppendLine("If the input word/phrase is meaningless, nonexistent in English, unexplainable, or too vulgar, you should output 'Cannot explain'.");
                promptBuilder.Append($"Please provide an explanation for '{keyword}'");
                promptBuilder.Append(!string.IsNullOrEmpty(context) ? $" in the context of '{context}'." : string.Empty);
                promptBuilder.AppendLine("Your output must include 11 sections as below:");
                promptBuilder.AppendLine($"- Title: '{keyword.ToUpper()}'");
                promptBuilder.AppendLine($"- Pronunciation and part of speech of '{keyword}', if the input is not a word but an idiom, omit the pronunciation.");
                promptBuilder.AppendLine($"- Explanation of '{keyword}' in the given context (if available). If there is no context, provide up to 10 of the most common meanings of '{keyword}' along with detailed explanations.");
                promptBuilder.AppendLine($"- Provide at least 5 usage examples of '{keyword}' along with some related vocabulary.");
                promptBuilder.AppendLine("- Provide at least 3 synonyms and 3 antonyms, if available, with detailed explanations.");
                promptBuilder.AppendLine($"- Provide some common sentences, idioms, or phrases containing '{keyword}'.");
                promptBuilder.AppendLine($"- Provide information about the root word and derivatives of '{keyword}' (if any).");
                promptBuilder.AppendLine($"- Provide information on the origin or history of '{keyword}' (if any).");
                promptBuilder.AppendLine($"- Include variations of '{keyword}' such as past tense, present tense, plural form, comparative form, etc. (if applicable).");
                promptBuilder.AppendLine($"- Include some lesser-known fun facts related to '{keyword}' (if any).");
                promptBuilder.AppendLine("Your output should be clear and detailed but not overly verbose.");
            }
            else
            {
                promptBuilder.Append("Bạn là từ một điển Anh-Việt siêu ưu việt sử dụng công nghệ AI vào việc tra cứu. Nhiệm vụ của bạn là giúp tôi giải nghĩa tiếng Anh.");
                promptBuilder.AppendLine("Nếu từ/cụm từ được input là một thứ vô nghĩa hoặc không tồn tại trong tiếng Anh hoặc không thể giải nghĩa được hoặc quá tục tĩu, bạn hãy đưa ra output là 'Không thể giải nghĩa'");
                promptBuilder.Append($"Hãy cho tôi lời giải thích của '{keyword}'");
                promptBuilder.Append(!string.IsNullOrEmpty(context) ? $" trong ngữ cảnh '{context}'." : string.Empty);
                promptBuilder.AppendLine("Nội dung output của bạn phải bao gồm 11 phần:");
                promptBuilder.AppendLine($"- Tiêu đề: '{keyword.ToUpper()}'");
                promptBuilder.AppendLine($"- Phiên âm và từ loại của '{keyword}', nếu input không phải là từ vựng mà là thành ngữ thì không cần phiên âm");
                promptBuilder.AppendLine($"- Giải nghĩa của '{keyword}' trong ngữ cảnh được cung cấp (nếu có), nếu không có ngữ cảnh thì cung cấp tối đa 10 nghĩa phổ biến nhất của '{keyword}' kèm lời giải thích chi tiết");
                promptBuilder.AppendLine($"- Cung cấp tối thiểu 5 ví dụ về trường hợp sử dụng kèm của '{keyword}' và một số từ vựng khác có liên quan.");
                promptBuilder.AppendLine("- Cung cấp tối thiểu 3 từ đồng nghĩa và 3 từ trái nghĩa nếu có, đồng thời giải thích chi tiết về chúng.");
                promptBuilder.AppendLine($"- Cung cấp một số mẫu câu hoặc thành ngữ hoặc cụm từ phổ biến chứa '{keyword}'.");
                promptBuilder.AppendLine($"- Cung cấp thông tin về từ gốc và các từ phái sinh của '{keyword}' (nếu có)");
                promptBuilder.AppendLine($"- Cung cấp thông tin về lịch sử hình thành của từ '{keyword}' (nếu có).");
                promptBuilder.AppendLine($"- Các dạng biến đổi của '{keyword}' được tra cứu như thì quá khứ, thì hiện tại, dạng số nhiều, dạng so sánh,... (nếu có).");
                promptBuilder.AppendLine($"- Một số fun facts ít người biết liên quan đến '{keyword}' (nếu có).");
                promptBuilder.AppendLine("Cách trình bày output của bạn phải thật dễ hiểu và chi tiết, tuy nhiên không được quá dài dòng.");
            }

            return await Gemini.Generator.GenerateContent(apiKey, promptBuilder.ToString(), false, 100);
        }
    }
}
