using Entities;
using Entities.Enums;
using Gemini;
using Helper;
using Newtonsoft.Json;
using System.Text;

namespace Events
{
    public static class ReviewScope
    {
        public const short MinTotalWords = 30;
        public const short MaxTotalWords = 500;
        public const int OneHourAsCachingAge = 3600;
        public const string EssayCriteria = @"
            1. **Grammar**:
               - **Serious grammatical errors**: Misusing basic grammatical structures such as incorrect verb conjugation, tense errors, or unclear sentence structures will affect your score.
               - **Lack of coherence in sentences**: If sentences are unclear or contain too many grammatical errors making it difficult for the reader to understand, points will be deducted.

            2. **Vocabulary**:
               - **Inappropriate word usage**: Using words incorrectly or in the wrong context will result in point deduction.
               - **Overly simple or repetitive vocabulary**: If you overuse simple words or repeatedly use the same words without variety, you will also lose points.

            3. **Coherence and Cohesion**:
               - **Disconnected sentences**: If the ideas in your writing are not logically connected or if you lack necessary transition words, your writing will be rated as lacking fluency.
               - **Lack of clear structure**: Your essay needs a clear introduction, body, and conclusion. If any part is missing or the writing is disorganized, points will be lost.

            4. **Failure to fully address the task**:
               - **Not addressing the main points**: If your essay doesn't directly respond to the prompt or goes off-topic, you will be significantly penalized.
               - **Incomplete response**: If your arguments or responses are underdeveloped or too brief, points will be deducted.

            5. **Spelling and Punctuation**:
               - **Spelling mistakes**: Too many basic spelling errors will impact your score.
               - **Incorrect punctuation usage**: Failing to use punctuation correctly, or overusing unnecessary punctuation marks, can also result in point deduction.

            6. **Idea Development**:
               - **Unclear or illogical ideas**: If the ideas in your essay are not well-developed or lack clarity, you will lose points.
               - **Lack of examples or supporting evidence**: In essay tasks, if you fail to provide examples to illustrate your points, the essay will be less convincing and lose points.

            7. **Length of the essay**:
               - **Too short or too long**: Each question in TOEIC Writing has a required length. If you write too little or exceed the word limit, you will lose points.

            8. **Lack of persuasiveness**:
               - **Weak arguments**: In opinion essays, if your arguments are not convincing, clear, or lack logic, you will lose points.
               - **Insufficient analysis**: If you only present ideas without analyzing or explaining them thoroughly, the essay will be rated lower in quality and logic.

            9. **Lack of sentence variety**:
               - **Using only simple sentences**: If you only use simple sentence structures without variety (such as complex or compound sentences), your writing may be seen as lacking creativity and professionalism.
               - **Using overly complex sentences incorrectly**: Conversely, if you attempt complex sentence structures but use them incorrectly, points will also be deducted.

            10. **Task fulfillment**:
               - **Not covering all aspects of the task**: If you don't address all the required aspects of the prompt or miss important points, your score will drop.
               - **Not completing all parts within the time limit**: If you run out of time and fail to complete all three sections (picture description, sentence writing, and essay writing), you will not achieve the maximum score.

            11. **Incorrect use of linking words**:
               - **Misusing linking words**: Using words like 'however', 'therefore', 'in addition', 'on the other hand' incorrectly or in the wrong part of the sentence makes the writing awkward and unclear.
               - **Lack of linking words**: Failing to use linking words to connect ideas will make your writing seem disjointed and hard to follow, leading to point deductions.

            12. **Inappropriate tone or style**:
               - **Tone not suitable for the task**: TOEIC Writing essays should be professional, academic, or formal. Using an informal tone or overly casual language will result in your essay being deemed inappropriate.
               - **Unprofessional language**: Overly colloquial words or phrases will also negatively affect the essay's tone and reduce your score.

            13. **Ignoring the audience**:
               - **Not adjusting writing style to suit the audience**: You need to adapt your style based on the audience specified in the prompt. Failure to do so will result in point deduction due to a lack of audience awareness.

            14. **Tense and verb form errors**:
               - **Using incorrect tense**: Mistakes in tense usage (past, present, future) not only violate grammatical rules but also confuse the reader.
               - **Incorrect verb conjugation**: Common errors like failing to add 's' to verbs in the third-person singular form in the present tense can result in deductions.

            15. **Poor paragraph structure**:
               - **Lack of clear paragraph breaks**: Failing to clearly separate ideas into distinct paragraphs will result in a lack of coherence. If you don’t properly segment your writing into individual ideas, the essay will be considered disorganized.
               - **No main topic in paragraphs**: Each paragraph should have a main topic sentence that introduces the idea, with supporting sentences. If there is no coherence within paragraphs, points will be lost.

            16. **Lack of examples and evidence**:
               - **Failing to support ideas with evidence**: When presenting opinions or arguments, if you do not provide specific examples or reasons, your writing will lack depth and persuasiveness, leading to point deduction.

            17. **Poor presentation**:
               - **Messy handwriting or organization**: While the format is not directly graded, if your writing is difficult to read or too messy, it may affect the reader’s impression and result in a lower score.
               - **Excessive or unnecessary abbreviations**: Using too many abbreviations or abbreviating unnecessarily can make your writing less formal and reduce its overall quality.

            18. **Inaccurate or misleading word choice**:
               - **Choosing incorrect words**: Using words that are inaccurate or cause confusion will make your essay unclear and affect its overall quality.

            In conclusion, to avoid losing points, it is important to practice writing coherently, use vocabulary and grammar correctly, and ensure that your essay addresses the task at hand appropriately.
            ";

        public static async Task<Comment> GenerateReview(string apiKey, EnglishLevel level, string content)
        {
            var instructionBuilder = new StringBuilder();
            var promptBuilder = new StringBuilder();
            var userLevel = GeneralHelper.GetEnumDescription(level);

            instructionBuilder.Append("You are an English teacher with over 20 years of experience, currently working at a large and reputable TOEIC training center. ");
            instructionBuilder.AppendLine("Your task is to read and analyze my essay, then provide high-detailed review and suggestions to improve the quality of the writing.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("This is the criteria for point deduction of the TOEIC writting assessment, you can use it as a reliable reference for your review:");
            instructionBuilder.AppendLine(EssayCriteria.Trim());
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("Your output must consist of two main sections as follows:");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("- **GeneralComment**: This section contains high-detailed comment, written in Vietnamese, for the entire essay. Your comments should be based on the content, writing style, and my level of English.");
            instructionBuilder.AppendLine("  - You need to identify spelling mistakes and provide specific corrections.");
            instructionBuilder.AppendLine("  - Detect and explain any grammatical errors (if present), along with clear suggestions for corrections.");
            instructionBuilder.AppendLine("  - Suggest alternatives for words or sentence structures where appropriate, to enhance the flow and contextual relevance of the essay.");
            instructionBuilder.AppendLine("  - Analyze the writing style and provide specific advice to align the essay with its intended audience and purpose.");
            instructionBuilder.AppendLine("  - Identify any logical errors (if any) and propose ways to correct them to make the essay more coherent and understandable.");
            instructionBuilder.AppendLine("  - All comments and suggestions for corrections should be explained in detail so that I can understand and apply them effectively.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("- **ImprovedContent**: This is the revised version of the essay based on the suggestions in the GeneralComment section.");
            instructionBuilder.AppendLine("  - You need to highlight the revised sections using ** at the beginning and end of the modified text.");
            instructionBuilder.AppendLine("  - Do not change the main content or ideas of the essay without justification.");
            instructionBuilder.AppendLine("  - Ensure that the revised essay does not exceed 1.5 times the length of the original essay.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("Your output must be a JSON object structured according to the following C# class:");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("```cs");
            instructionBuilder.AppendLine("class ReviewerResponse");
            instructionBuilder.AppendLine("{");
            instructionBuilder.AppendLine("    string GeneralComment;  // The high-detailed review for the essay in Vietnamese.");
            instructionBuilder.AppendLine("    string ImprovedContent; // Revised version of the essay following your review.");
            instructionBuilder.AppendLine("}");
            instructionBuilder.AppendLine("```");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("If my essay is nonsensical, unclear, or cannot be analyzed, the 'GeneralComment' field should contain 'Unable to comment,' and the 'ImprovedContent' field should be left empty.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("Here is an example of the output:");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("```json");
            instructionBuilder.AppendLine("{");
            instructionBuilder.AppendLine("  \"GeneralComment\": \"Bài viết của bạn có phong cách viết tốt, nhưng vẫn còn một số lỗi ngữ pháp và chính tả. Ví dụ, câu thứ hai sử dụng thì động từ sai. Bạn nên dùng thì quá khứ hoàn thành thay vì thì hiện tại hoàn thành.\"");
            instructionBuilder.AppendLine("  \"ImprovedContent\": \"**The second sentence** has been corrected to use the past perfect tense. The rest of the essay remains unchanged.\"");
            instructionBuilder.AppendLine("}");
            instructionBuilder.AppendLine("```");

            promptBuilder.AppendLine($"## My current English proficiency level according to CEFR standard:");
            promptBuilder.AppendLine(userLevel);
            promptBuilder.AppendLine("## My writting for you to review: ");
            promptBuilder.AppendLine(content.Trim());

            var result = await Generator.GenerateContent(apiKey, instructionBuilder.ToString(), promptBuilder.ToString(), true, 30, GenerativeModel.Gemini_20_Flash_Thinking);
            return JsonConvert.DeserializeObject<Comment>(result);
        }
    }
}
