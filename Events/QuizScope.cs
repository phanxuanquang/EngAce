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
                var promptBuilder = new StringBuilder();
                var userLevel = GeneralHelper.GetEnumDescription(level);
                var types = string.Join(", ", quizzTypes.Select(t => GeneralHelper.GetEnumDescription(t)).ToList());

                promptBuilder.AppendLine($"You are an English teacher with over 20 years of experience, you have worked in a Vietnamese high school for over 10 years. I am a Vietnamese whose English level according to the CEFR standard is {userLevel}. ");
                promptBuilder.Append($"Please provide a set of multiple-choice English questions consisting of {questionsCount} to {questionsCount + 5} questions related to the topic '{topic.Trim()}' for practice. ");
                promptBuilder.Append("The content of the questions should not exceed my English level. ");
                promptBuilder.Append($"Each question in the quiz should have only 4 options with exactly 1 correct choice, and the quiz should be of the types: {types}");
                promptBuilder.AppendLine("Return an empty array if the topic is meaningless, or cannot be determined, or cannot be understood.");
                promptBuilder.AppendLine("The output should be a JSON array corresponding to the following C# class: ");
                promptBuilder.AppendLine("class Quiz");
                promptBuilder.AppendLine("{");
                promptBuilder.AppendLine("    string Question; // The question content in English, ensure it matches my level");
                promptBuilder.AppendLine("    List<string> Options; // 4 choices for the user to select, ensure that the options are distinct, and there is only 1 correct option for the question.");
                promptBuilder.AppendLine("    int RightOptionIndex; // Index of the correct option in the 'Options' array, ensure this is the index of the most accurate and reasonable choice for the question (index range is from 0 to 3)");
                promptBuilder.AppendLine("    string ExplanationInVietnamese; // Short explanation in Vietnamese in a clear and reasonable manner, suitable for my English level");
                promptBuilder.AppendLine("}");
                promptBuilder.AppendLine("In order to help to do the task more correctly and effectively, here is an example of the response I want:");
                promptBuilder.AppendLine("[");
                promptBuilder.AppendLine("    {");
                promptBuilder.AppendLine("        \"Question\": \"Question content no. 1\",");
                promptBuilder.AppendLine("        \"Options\": [\"Option 1\", \"Option 2\", \"Option 3\", \"Option 4\"],");
                promptBuilder.AppendLine("        \"RightOptionIndex\": 0,");
                promptBuilder.AppendLine("        \"ExplanationInVietnamese\": \"The short explanation for the correct answer in Vietnamese\"");
                promptBuilder.AppendLine("    },");
                promptBuilder.AppendLine("    {");
                promptBuilder.AppendLine("        \"Question\": \"Question content no. 2\",");
                promptBuilder.AppendLine("        \"Options\": [\"Option 1\", \"Option 2\", \"Option 3\", \"Option 4\"],");
                promptBuilder.AppendLine("        \"RightOptionIndex\": 2,");
                promptBuilder.AppendLine("        \"ExplanationInVietnamese\": \"The short explanation for the correct answer in Vietnamese\"");
                promptBuilder.AppendLine("    }");
                promptBuilder.AppendLine("]");
                promptBuilder.AppendLine("The output:");

                var response = await Generator.GenerateContent(apiKey, promptBuilder.ToString(), true, 50);
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
                var userLevel = GeneralHelper.GetEnumDescription(level);
                var type = GeneralHelper.GetEnumDescription(quizzType);

                promptBuilder.AppendLine($"You are an English teacher with over 20 years of experience, you have worked in a Vietnamese high school for over 10 years. I am a Vietnamese whose English level according to the CEFR standard is {userLevel}. ");
                promptBuilder.Append($"Please provide a set of multiple-choice English questions consisting of up-to {questionsCount + 5} questions related to the topic '{topic.Trim()}' for practice. ");
                promptBuilder.Append("The content of the questions should not exceed my English level. ");
                promptBuilder.Append($"Each question in the quiz should have only 4 options with exactly 1 correct choice, and the type of the quizzes must be: {type}");
                promptBuilder.AppendLine("Return an empty array if the topic is meaningless, or cannot be determined, or cannot be understood.");
                promptBuilder.AppendLine("The output should be a JSON array corresponding to the following C# class: ");
                promptBuilder.AppendLine("class Quiz");
                promptBuilder.AppendLine("{");
                promptBuilder.AppendLine("    string Question; // The question content in English, ensure it matches my level");
                promptBuilder.AppendLine("    List<string> Options; // 4 choices for the user to select, ensure that the options are distinct, and there is only 1 correct option for the question.");
                promptBuilder.AppendLine("    int RightOptionIndex; // Index of the correct option in the 'Options' array, ensure this is the index of the most accurate and reasonable choice for the question (index range is from 0 to 3)");
                promptBuilder.AppendLine("    string ExplanationInVietnamese; // Short explanation in Vietnamese in a clear and reasonable manner, suitable for my English level");
                promptBuilder.AppendLine("}");
                promptBuilder.AppendLine("In order to help to do the task more correctly and effectively, here is an example of the response I want:");
                promptBuilder.AppendLine("[");
                promptBuilder.AppendLine("    {");
                promptBuilder.AppendLine("        \"Question\": \"Question content no. 1\",");
                promptBuilder.AppendLine("        \"Options\": [\"Option 1\", \"Option 2\", \"Option 3\", \"Option 4\"],");
                promptBuilder.AppendLine("        \"RightOptionIndex\": 0,");
                promptBuilder.AppendLine("        \"ExplanationInVietnamese\": \"The short explanation for the correct answer in Vietnamese\"");
                promptBuilder.AppendLine("    },");
                promptBuilder.AppendLine("    {");
                promptBuilder.AppendLine("        \"Question\": \"Question content no. 2\",");
                promptBuilder.AppendLine("        \"Options\": [\"Option 1\", \"Option 2\", \"Option 3\", \"Option 4\"],");
                promptBuilder.AppendLine("        \"RightOptionIndex\": 2,");
                promptBuilder.AppendLine("        \"ExplanationInVietnamese\": \"The short explanation for the correct answer in Vietnamese\"");
                promptBuilder.AppendLine("    }");
                promptBuilder.AppendLine("]");
                promptBuilder.AppendLine("The output:");

                var response = await Generator.GenerateContent(apiKey, promptBuilder.ToString(), true, 50);

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

            promptBuilder.AppendLine($"You are an IELTS teacher with over 20 years of experience, teaching in Vietnam. My English level according to the CEFR standard is {userLevel}.");
            promptBuilder.Append($"I am looking for interesting topics to practice English that match my current level, and I also want to have more motivation for learning.");
            promptBuilder.AppendLine("Please suggest at least 40 completely different topics with less than 5 words that you think are most suitable and interesting for practicing English.");
            promptBuilder.Append("The list of suggested topics should be a JSON array corresponding to the List<string> data type in C# programming language.");
            promptBuilder.AppendLine("In order to help you to do the task more correctly and more effectively, here is an example of the response I want:");
            promptBuilder.AppendLine("[");
            promptBuilder.AppendLine("  \"Topic 1\",");
            promptBuilder.AppendLine("  \"Topic 2\",");
            promptBuilder.AppendLine("  \"Topic 3\",");
            promptBuilder.AppendLine("  \"Topic 4\"");
            promptBuilder.AppendLine("]");
            promptBuilder.Append("Your response:");

            var response = await Generator.GenerateContent(apiKey, promptBuilder.ToString(), true, 75);
            return [.. JsonConvert.DeserializeObject<List<string>>(response)];
        }
    }
}
