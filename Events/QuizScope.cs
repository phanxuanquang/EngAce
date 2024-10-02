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
        public const int ThreeDaysAsCachingAge = 259200;
        public const int MaxTimeAsCachingAge = int.MaxValue;

        public static async Task<List<Quiz>> GenerateQuizes(string apiKey, string topic, List<QuizzType> quizzTypes, EnglishLevel level, short questionsCount)
        {
            if (questionsCount <= 15)
            {
                var results = await GenerateQuizesForLessThan15(apiKey, topic, quizzTypes, level, questionsCount);

                if (results == null || results.Count == 0)
                {
                    throw new InvalidOperationException("Error while executing");
                }

                return results
                    .Take(questionsCount)
                    .Select(q => new Quiz
                    {
                        Question = q.Question.Replace("**", "'"),
                        Options = q.Options.Select(o => o.Replace("**", "'")).ToList(),
                        RightOptionIndex = q.RightOptionIndex,
                        ExplanationInVietnamese = q.ExplanationInVietnamese.Replace("**", "'"),
                    })
                    .ToList();
            }
            else
            {
                var quizes = new List<Quiz>();
                var quizTypeQuestionCount = GeneralHelper.GenerateRandomNumbers(quizzTypes.Count, questionsCount);
                var tasks = new List<Task<List<Quiz>>>();

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

                var random = new Random();
                return quizes
                    .AsParallel()
                    .OrderBy(x => random.Next())
                    .Take(questionsCount)
                    .Select(q => new Quiz
                    {
                        Question = q.Question.Replace("**", "'"),
                        Options = q.Options.Select(o => o.Replace("**", "'")).ToList(),
                        RightOptionIndex = q.RightOptionIndex,
                        ExplanationInVietnamese = q.ExplanationInVietnamese.Replace("**", "'"),
                    })
                    .ToList();
            }
        }

        private static async Task<List<Quiz>> GenerateQuizesForLessThan15(string apiKey, string topic, List<QuizzType> quizzTypes, EnglishLevel level, int questionsCount)
        {
            try
            {
                var userLevel = GeneralHelper.GetEnumDescription(level);
                var types = string.Join(", ", quizzTypes.Select(t => GeneralHelper.GetEnumDescription(t)).ToList());
                var promptBuilder = new StringBuilder();

                promptBuilder.Append($"I am a Vietnamese learner with an English level of {userLevel} according to the CEFR standard.");
                promptBuilder.AppendLine($"Generate a set of multiple-choice English questions consisting of {questionsCount} to {questionsCount + 5} questions related to the topic '{topic.Trim()}' for me to practice, the quiz should be of the types: {types}");
                promptBuilder.AppendLine("The output:");

                var response = await Generator.GenerateContent(apiKey, InitInstruction(), promptBuilder.ToString(), true, 30);
                return [.. JsonConvert.DeserializeObject<List<Quiz>>(response)];
            }
            catch
            {
                return [];
            }
        }

        private static async Task<List<Quiz>> GenerateQuizesByType(string apiKey, string topic, QuizzType quizzType, EnglishLevel level, int questionsCount)
        {
            try
            {
                var promptBuilder = new StringBuilder();
                var instructionBuilder = new StringBuilder();
                var userLevel = GeneralHelper.GetEnumDescription(level);
                var type = GeneralHelper.GetEnumDescription(quizzType);

                instructionBuilder.AppendLine("You are an experienced IELTS teacher with over 20 years of experience, currently teaching in Vietnam.");
                instructionBuilder.Append("I am looking for a list of interesting and engaging topics that match my current English proficiency level, as well as topics that can help me stay motivated in my learning journey.");
                instructionBuilder.AppendLine("Please suggest at least 40 completely different topics, each containing fewer than 5 words, that you think are most suitable and interesting for practicing English.");
                instructionBuilder.AppendLine("The topics should cover a variety of themes, such as daily life, culture, education, environment, travel, etc., to keep the practice diverse and engaging.");
                instructionBuilder.AppendLine();
                instructionBuilder.AppendLine("The list of suggested topics should be returned as a JSON array corresponding to the List<string> data type in C# programming language.");
                instructionBuilder.AppendLine("To make the format clear, here's an example of the expected output:");
                instructionBuilder.AppendLine("[");
                instructionBuilder.AppendLine("  \"Family traditions\",");
                instructionBuilder.AppendLine("  \"Modern technology\",");
                instructionBuilder.AppendLine("  \"Travel experiences\",");
                instructionBuilder.AppendLine("  \"Global warming\"");
                instructionBuilder.AppendLine("]");
                instructionBuilder.AppendLine();
                instructionBuilder.AppendLine("Make sure that each topic is unique, concise, and relevant for practicing English at different levels, especially intermediate to advanced.");

                promptBuilder.Append($"I am a Vietnamese learner with an English level of {userLevel} according to the CEFR standard.");
                promptBuilder.AppendLine($"Generate a set of multiple-choice English questions consisting of {questionsCount} to {questionsCount + 5} questions related to the topic '{topic.Trim()}' for me to practice, the type of the questions must be: {type}");
                promptBuilder.AppendLine("The output:");

                var response = await Generator.GenerateContent(apiKey, instructionBuilder.ToString(), promptBuilder.ToString(), true, 30);

                return JsonConvert.DeserializeObject<List<Quiz>>(response)
                    .Select(quiz =>
                    {
                        quiz.Question = $"({NameAttribute.GetEnumName(quizzType)}) {quiz.Question}";
                        return quiz;
                    })
                    .ToList();
            }
            catch
            {
                return [];
            }
        }

        public static async Task<List<string>> SuggestTopcis(string apiKey, EnglishLevel level)
        {
            var promptBuilder = new StringBuilder();

            var userLevel = GeneralHelper.GetEnumDescription(level);

            var instruction = "You are an experienced IELTS teacher with over 20 years of experience, currently teaching in Vietnam. I am looking for a list of interesting and engaging topics that match my current English proficiency level, as well as topics that can help me stay motivated in my learning journey.";

            promptBuilder.AppendLine($"My current English proficiency level is '{userLevel}' according to the CEFR standard.");
            promptBuilder.AppendLine("Please suggest at least 40 completely different topics, each containing fewer than 5 words, that you think are most suitable and interesting for practicing English.");
            promptBuilder.AppendLine("The topics should cover a variety of themes, such as daily life, culture, education, environment, travel, etc., to keep the practice diverse and engaging.");
            promptBuilder.AppendLine();
            promptBuilder.AppendLine("The list of suggested topics should be returned as a JSON array corresponding to the List<string> data type in C# programming language.");
            promptBuilder.AppendLine("To make the format clear, here's an example of the expected output:");
            promptBuilder.AppendLine("[");
            promptBuilder.AppendLine("  \"Family traditions\",");
            promptBuilder.AppendLine("  \"Modern technology\",");
            promptBuilder.AppendLine("  \"Travel experiences\",");
            promptBuilder.AppendLine("  \"Global warming\"");
            promptBuilder.AppendLine("]");
            promptBuilder.AppendLine();
            promptBuilder.AppendLine("Make sure that each topic is unique, concise, and relevant for practicing English at different levels, especially intermediate to advanced.");
            promptBuilder.Append("Your response:");

            var response = await Generator.GenerateContent(apiKey, instruction, promptBuilder.ToString(), true, 75);
            return [.. JsonConvert.DeserializeObject<List<string>>(response)];
        }

        private static string InitInstruction()
        {
            var instructionBuilder = new StringBuilder();
            instructionBuilder.AppendLine($"You are an experienced English teacher with over 20 years of experience, having taught in a Vietnamese high school for over 10 years.");
            instructionBuilder.AppendLine("You should a set of multiple-choice English questions that match my English level, ensuring that the difficulty is appropriate and aligned with the CEFR standard, and each question must have only 4 options with exactly 1 correct choice.");
            instructionBuilder.AppendLine("Return an empty array if the input topic is unclear, irrelevant, or cannot be understood.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("The output should be a valid JSON array corresponding to the following C# class definition:");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("class Quiz");
            instructionBuilder.AppendLine("{");
            instructionBuilder.AppendLine("    string Question; // The question content in English. Ensure it matches my level and is grammatically correct.");
            instructionBuilder.AppendLine("    List<string> Options; // A list of 4 distinct choices. There must be only 1 correct option.");
            instructionBuilder.AppendLine("    int RightOptionIndex; // The index (0-3) of the correct option in the 'Options' list. Ensure this is the most accurate and logical answer.");
            instructionBuilder.AppendLine("    string ExplanationInVietnamese; // A brief, clear explanation in Vietnamese that is suitable for my English level.");
            instructionBuilder.AppendLine("}");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("Ensure the questions are practical, engaging, and fit my English proficiency level, using language that is not overly complex.");
            instructionBuilder.AppendLine("Your response should prioritize clarity and consistency.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("Here is an example of the expected response format:");
            instructionBuilder.AppendLine("[");
            instructionBuilder.AppendLine("    {");
            instructionBuilder.AppendLine("        \"Question\": \"What is the capital of England?\",");
            instructionBuilder.AppendLine("        \"Options\": [\"Paris\", \"Berlin\", \"London\", \"Rome\"],");
            instructionBuilder.AppendLine("        \"RightOptionIndex\": 2,");
            instructionBuilder.AppendLine("        \"ExplanationInVietnamese\": \"London là thủ đô của Anh.\"");
            instructionBuilder.AppendLine("    },");
            instructionBuilder.AppendLine("    {");
            instructionBuilder.AppendLine("        \"Question\": \"Which one is a fruit?\",");
            instructionBuilder.AppendLine("        \"Options\": [\"Carrot\", \"Apple\", \"Bread\", \"Chicken\"],");
            instructionBuilder.AppendLine("        \"RightOptionIndex\": 1,");
            instructionBuilder.AppendLine("        \"ExplanationInVietnamese\": \"'Apple' là tên một loại trái cây.\"");
            instructionBuilder.AppendLine("    }");
            instructionBuilder.AppendLine("]");
            return instructionBuilder.ToString();
        }
    }
}
