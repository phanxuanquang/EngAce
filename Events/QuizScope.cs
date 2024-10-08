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

                return quizes.Count == 0 ? quizes : quizes
                    .AsParallel()
                    .OrderBy(x => random.Next())
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

                promptBuilder.AppendLine($"I am a Vietnamese learner with the English proficiency level of '{userLevel}' according to the CEFR standard.");
                promptBuilder.AppendLine("This is the decription of my level according to the CEFR standard:");
                promptBuilder.AppendLine(GetLevelDescription(level));
                promptBuilder.AppendLine();
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
                var userLevel = GeneralHelper.GetEnumDescription(level);
                var type = GeneralHelper.GetEnumDescription(quizzType);

                promptBuilder.AppendLine($"I am a Vietnamese learner with the English proficiency level of '{userLevel}' according to the CEFR standard.");
                promptBuilder.AppendLine("This is the decription of my level according to the CEFR standard:");
                promptBuilder.AppendLine(GetLevelDescription(level));
                promptBuilder.AppendLine();
                promptBuilder.AppendLine($"Generate a set of multiple-choice English questions consisting of {questionsCount} to {questionsCount + 5} questions related to the topic '{topic.Trim()}' for me to practice, the type of the questions must be: {type}");
                promptBuilder.AppendLine("The output:");

                var response = await Generator.GenerateContent(apiKey, InitInstruction(), promptBuilder.ToString(), true, 30);

                return JsonConvert.DeserializeObject<List<Quiz>>(response)
                    .Take(questionsCount)
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
            promptBuilder.AppendLine("This is the decription of my English proficiency according to the CEFR standard:");
            promptBuilder.AppendLine(GetLevelDescription(level));
            promptBuilder.AppendLine();
            promptBuilder.AppendLine("Please suggest at least 40 completely different topics, each containing fewer than 5 words, that you think are most suitable and interesting for practicing English and match the description of my CEFR level as mentioned above.");
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
            instructionBuilder.AppendLine("You are an experienced English teacher with over 20 years of experience, having taught in a Vietnamese high school for over 10 years.");
            instructionBuilder.AppendLine("I will let you know about my current English proficiency level according to the CEFR standard, and the topic that I want to practice.");
            instructionBuilder.AppendLine("You should generate a set of unique multiple-choice English questions that the difficulty is appropriate and aligned with my current English proficiency level, and each question must have only unique 4 choices with exactly 1 correct choice.");
            instructionBuilder.AppendLine("Return an empty array if the input topic is unclear, irrelevant, or cannot be understood.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("The output should be a valid JSON array corresponding to the following C# class definition:");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("class Quiz");
            instructionBuilder.AppendLine("{");
            instructionBuilder.AppendLine("    string Question; // The question content in English. Ensure it matches my level and is grammatically correct.");
            instructionBuilder.AppendLine("    List<string> Options; // A list of 4 unique choices. There must be only 1 correct choice.");
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
        private static string GetLevelDescription(EnglishLevel level)
        {
            var A1_Description = @"Level A1 (Beginner)
            Grammar:
            - **Verb 'to be' and 'to have'**: Used for simple present tense sentences to describe identity, location, or possession (e.g., 'I am a teacher', 'She has a book', 'He is at home').
            - **Present Simple Tense**: Used for habits and routines, forming sentences with subjects and basic verbs (e.g., 'I eat breakfast every day', 'She goes to school').
            - **Yes/No Questions with 'to be' and 'do'**: Forming basic Yes/No questions using auxiliary verbs (e.g., 'Are you a student?', 'Do you like coffee?').
            - **Wh- Questions (What, Where, When)**: Using Wh- questions to ask for information (e.g., 'Where is the bus stop?', 'What time is it?').
            - **Articles (a, an, the)**: Correct use of definite and indefinite articles before singular countable nouns (e.g., 'a cat', 'an apple', 'the book').
            - **Simple Prepositions of Place**: Understanding and using 'in', 'on', 'under', 'next to' to describe location (e.g., 'The cat is under the table').
            - **Basic Adjectives**: Learning adjectives to describe size, color, and appearance (e.g., 'a big house', 'a red apple').

            Grammar Scope:
            - Limited to simple present tense.
            - Simple sentence structure (subject + verb + object).
            - Basic questions and negations (e.g., 'I don't like apples').

            Vocabulary Range:
            - **Everyday Vocabulary**: Basic words for everyday situations such as food, family, personal information.
            - **Nouns**: Names of common objects (e.g., 'table', 'car', 'house').
            - **Verbs**: Frequently used action verbs (e.g., 'eat', 'drink', 'walk').
            - **Adjectives**: Common descriptive words (e.g., 'good', 'bad', 'hot', 'cold').
            - **Topics**: Family, basic needs, work and jobs, daily routines, preferences.";

            var A2_Description = @"Level A2 (Elementary)
            Grammar:
            - **Present Continuous Tense**: Used to describe actions happening at the moment (e.g., 'I am reading a book', 'They are playing soccer').
            - **Past Simple Tense**: Used for completed actions in the past, including regular and irregular verbs (e.g., 'I visited the museum', 'She went to the market').
            - **Modals (can, must, should)**: Expressing ability, permission, and obligation (e.g., 'I can swim', 'You must finish your homework').
            - **Comparative and Superlative Adjectives**: Forming comparisons (e.g., 'My brother is taller than me', 'This is the best restaurant').
            - **Future Simple (will)**: Talking about future plans and decisions (e.g., 'I will travel next week').
            - **Adverbs of Frequency**: Describing how often actions occur (e.g., 'always', 'usually', 'sometimes').
            - **Possessive Pronouns**: Understanding 'mine', 'yours', 'his', 'hers' (e.g., 'This book is mine').

            Grammar Scope:
            - Multiple tenses: present, past, and future simple.
            - Use of conjunctions ('and', 'but', 'because') for longer sentences.
            - Modals to express different levels of certainty and ability.

            Vocabulary Range:
            - **Expanding Basic Vocabulary**: Including words for daily routines, transportation, holidays.
            - **Nouns**: Public places (e.g., 'airport', 'library'), hobbies (e.g., 'reading', 'swimming').
            - **Verbs**: Verbs of movement (e.g., 'run', 'jump'), travel verbs (e.g., 'fly', 'drive').
            - **Topics**: Health, shopping, leisure activities, describing feelings and emotions.";

            var B1_Description = @"Level B1 (Intermediate)
            Grammar:
            - **Present Perfect Tense**: Used to link the past and present (e.g., 'I have lived here for five years').
            - **Past Continuous Tense**: Describing ongoing actions in the past (e.g., 'I was reading when you called').
            - **First and Second Conditional**: Expressing possible and hypothetical situations (e.g., 'If I study, I will pass', 'If I were rich, I would travel').
            - **Passive Voice**: Shifting focus from the subject to the action (e.g., 'The book was written by him').
            - **Relative Clauses (who, which, that)**: Providing additional information about nouns (e.g., 'The man who works here is friendly').
            - **Reported Speech**: Describing what someone said (e.g., 'He said that he would come').

            Grammar Scope:
            - Combining multiple tenses for more complex sentence structures.
            - Using relative clauses to add detail and clarity.
            - Passive voice to discuss formal or written topics.

            Vocabulary Range:
            - **Broader Vocabulary for Discussion**: Words for work, education, culture, sports.
            - **Nouns**: Workplaces (e.g., 'office', 'factory'), education (e.g., 'course', 'exam').
            - **Verbs**: 'advise', 'describe', 'explain'.
            - **Topics**: Opinions, aspirations, experiences, describing events.";

            var B2_Description = @"Level B2 (Upper-Intermediate)
            Grammar:
            - **Third Conditional**: Describing unreal past situations (e.g., 'If I had known, I would have helped').
            - **Advanced Passive Voice**: Used for emphasis or formal writing (e.g., 'The results have been analyzed').
            - **Cleft Sentences (It is/was... that/who)**: For emphasis (e.g., 'It was John who finished the task').
            - **Phrasal Verbs**: Understanding meaning and usage in context (e.g., 'give up', 'put up with').
            - **Complex Relative Clauses**: Adding layers of detail (e.g., 'The book, which was written in 1990, is still relevant').

            Grammar Scope:
            - Mastery of conditionals, passives, and complex relative clauses.
            - Use of emphasis and nuance in formal and informal writing.

            Vocabulary Range:
            - **Specialized Vocabulary**: Environment, politics, technology, abstract concepts.
            - **Nouns**: 'pollution', 'legislation'.
            - **Verbs**: 'negotiate', 'emphasize'.
            - **Topics**: Debate, argumentation, academic discussions.";

            var C1_Description = @"Level C1 (Advanced)
            Grammar:
            - **Inversion for Emphasis**: Using inverted structures (e.g., 'Never have I seen such a view').
            - **Advanced Modal Verbs**: Speculation and deduction (e.g., 'She must have been tired').
            - **Mixed Conditionals**: Linking past, present, and future (e.g., 'If I had studied, I would be more confident now').
            - **Complex Reported Speech**: Describing multiple sources (e.g., 'He claimed that they had already left').

            Grammar Scope:
            - Mastery of nuanced grammar for precise communication.
            - High-level linking structures and discourse markers.

            Vocabulary Range:
            - **Academic and Technical Vocabulary**: Economics, science, critical theory.
            - **Nouns**: 'methodology', 'innovation'.
            - **Verbs**: 'analyze', 'justify'.
            - **Topics**: Research, professional analysis, critical thinking.";

            var C2_Description = @"Level C2 (Proficient)
            Grammar:
            - **Complex Syntax and Stylistic Devices**: Mastery of rhetoric, ellipsis, and advanced syntax.
            - **Subtle Usage of Mood and Aspect**: Use of subjunctive and conditional to convey tone.
            - **Literary and Idiomatic Expressions**: Ability to use metaphor, irony, and academic discourse.

            Grammar Scope:
            - Full flexibility in grammar use.
            - Precise adaptation to style and context.

            Vocabulary Range:
            - **Highly Advanced Vocabulary**: Philosophy, literature, high-level research.
            - **Nouns**: 'dialectics', 'semantics'.
            - **Verbs**: 'elucidate', 'expound'.
            - **Topics**: Advanced academic and professional settings.";


            switch (level)
            {
                case EnglishLevel.Beginner:
                    return A1_Description;
                case EnglishLevel.Elementary: 
                    return A2_Description;
                case EnglishLevel.Intermediate:
                    return B1_Description;
                case EnglishLevel.UpperIntermediate:
                    return B2_Description;
                case EnglishLevel.Advanced:
                    return C1_Description;
                case EnglishLevel.Proficient:
                    return C2_Description;
                default: 
                    return string.Empty;
            }
        }
    }
}
