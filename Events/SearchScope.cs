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
                promptBuilder.Append("You are an English teacher with over 20 years of experience and also a language researcher specializing in the English language. ");
                promptBuilder.Append($"Please explain the meaning of '{keyword}' in a very easy-to-understand way,");
                if (!string.IsNullOrEmpty(context))
                {
                    promptBuilder.Append($" the context of the word is that '{context}'.");
                }
                promptBuilder.AppendLine("Your response must include 8 parts:");
                promptBuilder.AppendLine("- The IPA transcription and the part of speech (noun, verb, adjective, adverb, etc.) of the searched word.");
                promptBuilder.AppendLine("- The explanation of the word in the provided context (if any), if there is no context, provide up to 10 most common meanings of the searched word with detailed explanations.");
                promptBuilder.AppendLine("- Provide at least 5 examples of how to apply and the circumstances in which the searched word is used, along with some related vocabulary.");
                promptBuilder.AppendLine("- Provide at least 3 synonyms and antonyms, if any, and explain them in detail.");
                promptBuilder.AppendLine("- Provide some common idioms and phrases related to the word.");
                promptBuilder.AppendLine("- Provide information on the root word and its derivatives to give a deeper understanding of the word structure.");
                promptBuilder.AppendLine("- Provide historical and cultural information related to the searched word (if any).");
                promptBuilder.AppendLine("- The variations of the searched word, such as past tense, present tense, plural form, comparative form, etc.");
                promptBuilder.AppendLine("The format of your response must be very professional and very easy to understand, but not too verbose.");
            }
            else
            {
                promptBuilder.Append("Bạn là một giáo viên dạy tiếng Anh với hơn 20 năm kinh nghiệm và cũng là một nhà nghiên cứu chuyên sâu về ngôn ngữ tiếng Anh. ");
                promptBuilder.Append($"Hãy giải thích một cách thật dễ hiểu nghĩa của '{keyword}'");
                if (!string.IsNullOrEmpty(context))
                {
                    promptBuilder.Append($" trong ngữ cảnh '{context}'.");
                }
                promptBuilder.AppendLine("Nội dung output của bạn phải bao gồm 8 phần:");
                promptBuilder.AppendLine("- Phiên âm IPA và từ loại (danh từ, động từ, tính từ, trạng từ,...) của từ được tra cứu");
                promptBuilder.AppendLine("- Định nghĩa của từ được tra trong ngữ cảnh được cung cấp (nếu có), nếu không có ngữ cảnh thì cho tôi tối đa 10 nghĩa phổ biến nhất của từ được tra cứu kèm lời giải thích chi tiết");
                promptBuilder.AppendLine("- Cung cấp tối thiểu 5 ví dụ về cách áp dụng và hoàn cảnh áp từ được tra cứu và một số từ vựng khác có liên quan");
                promptBuilder.AppendLine("- Cung cấp tối thiểu 3 từ đồng nghĩa và từ trái nghĩa nếu có, đồng thời giải thích chi tiết về chúng.");
                promptBuilder.AppendLine("- Cung cấp một số thành ngữ và cụm từ phổ biến liên quan chứa từ đó");
                promptBuilder.AppendLine("- Cung cấp thông tin về từ gốc và các từ phái sinh để hiểu sâu hơn về cấu trúc từ");
                promptBuilder.AppendLine("- Cung cấp thông tin về lịch sử và văn hóa liên quan đến từ được tra cứu (nếu có)");
                promptBuilder.AppendLine("- Các dạng biến đổi của từ được tra cứu như thì quá khứ, thì hiện tại, dạng số nhiều, dạng so sánh,...");
                promptBuilder.AppendLine("Cách trình bày output của bạn phải thật chuyên nghiệp và phải thật dễ hiểu, tuy nhiên không được quá dài dòng.");
            }

            return await Gemini.Generator.Generate(apiKey, promptBuilder.ToString(), false);
        }
    }
}
