using System.Text;

namespace Events
{
    public static class SearchScope
    {
        public const sbyte MaxKeywordTotalWords = 7;
        public const sbyte MaxContextTotalWords = 15;
        public static async Task<string> Search(string apiKey, bool useEnglish, string keyword, string context)
        {
            var instructionBuilder = new StringBuilder();
            var promptBuilder = new StringBuilder();
            keyword = keyword.Trim();

            if (useEnglish)
            {
                instructionBuilder.AppendLine("You are a highly advanced English-Vietnamese dictionary powered by AI technology. Your mission is to help me understand and explain English words.");
                instructionBuilder.AppendLine("If the input word or phrase is meaningless, nonexistent in English, unexplainable, or too vulgar, your response should be 'Cannot explain.'");
                instructionBuilder.AppendLine("Please provide a detailed explanation for the requested word or phrase.");
                instructionBuilder.AppendLine("Your response must include the following 11 sections:");
                instructionBuilder.AppendLine("- Title: The word or phrase in uppercase.");
                instructionBuilder.AppendLine("- Pronunciation and part of speech. If the input is an idiom, omit the pronunciation.");
                instructionBuilder.AppendLine("- Explanation of the word or phrase in the given context. If no context is available, provide up to 10 common meanings along with detailed explanations.");
                instructionBuilder.AppendLine("- Provide at least 5 usage examples along with related vocabulary.");
                instructionBuilder.AppendLine("- Include at least 3 synonyms and 3 antonyms with detailed explanations.");
                instructionBuilder.AppendLine("- Provide common sentences, idioms, or phrases that include the word or phrase.");
                instructionBuilder.AppendLine("- Include information about the root word and any derivatives, if applicable.");
                instructionBuilder.AppendLine("- Provide information on the origin or history of the word, if available.");
                instructionBuilder.AppendLine("- Include variations such as past tense, present tense, plural form, comparative form, etc., if applicable.");
                instructionBuilder.AppendLine("- Share some lesser-known fun facts related to the word or phrase, if any.");
                instructionBuilder.AppendLine("Your output should be clear and detailed, but avoid unnecessary verbosity.");

                promptBuilder.AppendLine($"Give me the detailed explanation for the keyword '{keyword}'");
                promptBuilder.Append(!string.IsNullOrEmpty(context) ? $" in the context of '{context}'." : string.Empty);
            }
            else
            {
                instructionBuilder.AppendLine("Bạn là một từ điển Anh-Việt siêu ưu việt sử dụng công nghệ AI. Nhiệm vụ của bạn là giúp tôi hiểu và giải nghĩa các từ tiếng Anh.");
                instructionBuilder.AppendLine("Nếu từ hoặc cụm từ input là vô nghĩa, không tồn tại trong tiếng Anh, không thể giải nghĩa được hoặc quá tục tĩu, hãy trả lời là 'Không thể giải nghĩa.'");
                instructionBuilder.AppendLine("Hãy cung cấp một lời giải thích chi tiết cho từ hoặc cụm từ được yêu cầu.");
                instructionBuilder.AppendLine("Nội dung trả lời của bạn phải bao gồm 11 phần sau:");
                instructionBuilder.AppendLine("- Tiêu đề: Từ hoặc cụm từ được viết in hoa toàn bộ.");
                instructionBuilder.AppendLine("- Phiên âm và từ loại. Nếu input là thành ngữ thì không cần phiên âm.");
                instructionBuilder.AppendLine("- Giải thích của từ hoặc cụm từ trong ngữ cảnh đã cho. Nếu không có ngữ cảnh, cung cấp tối đa 10 nghĩa phổ biến kèm lời giải thích chi tiết.");
                instructionBuilder.AppendLine("- Cung cấp tối thiểu 5 ví dụ sử dụng kèm từ vựng liên quan.");
                instructionBuilder.AppendLine("- Bao gồm tối thiểu 3 từ đồng nghĩa và 3 từ trái nghĩa với lời giải thích chi tiết.");
                instructionBuilder.AppendLine("- Cung cấp các mẫu câu, thành ngữ, hoặc cụm từ phổ biến có chứa từ hoặc cụm từ đó.");
                instructionBuilder.AppendLine("- Bao gồm thông tin về từ gốc và các từ phái sinh nếu có.");
                instructionBuilder.AppendLine("- Cung cấp thông tin về nguồn gốc hoặc lịch sử của từ nếu có.");
                instructionBuilder.AppendLine("- Bao gồm các dạng biến đổi như thì quá khứ, thì hiện tại, dạng số nhiều, dạng so sánh,... nếu có.");
                instructionBuilder.AppendLine("- Chia sẻ một số thông tin thú vị ít người biết về từ hoặc cụm từ đó nếu có.");

                promptBuilder.Append($"Hãy cung cấp lời giải thích thật chi tiết của '{keyword}'");
                promptBuilder.Append(!string.IsNullOrEmpty(context) ? $" trong ngữ cảnh '{context}'." : string.Empty);
            }

            return await Gemini.Generator.GenerateContent(apiKey, instructionBuilder.ToString(), promptBuilder.ToString().Trim(), false, 50);
        }
    }
}
