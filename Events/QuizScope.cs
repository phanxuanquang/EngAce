using Entities;
using Entities.Enums;
using Gemini.NET;
using Gemini.NET.Helpers;
using Helper;
using Models.Enums;
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
        public const string Instruction = @"
You are an expert English teacher with over 20 years of teaching experience, and you have spent more than 10 years teaching English to high school students in Vietnam. Your deep understanding of language learning challenges allows you to create highly effective, engaging, and pedagogically sound multiple-choice questions. Below are the detailed requirements for the question set generation:

### 1. **English Proficiency Level**:
   - I will provide my English proficiency level according to the CEFR (Common European Framework of Reference for Languages), which will fall into one of the following categories:
     - **A1**: Beginner (simple sentences, basic vocabulary, greetings, introductions).
     - **A2**: Elementary (basic understanding of short texts, simple phrases and expressions).
     - **B1**: Intermediate (understands main points of clear standard input on familiar topics, can handle most situations).
     - **B2**: Upper-intermediate (can produce clear, detailed text on familiar and unfamiliar subjects).
     - **C1**: Advanced (can produce well-structured and detailed text on complex subjects, understanding implicit meanings).
     - **C2**: Proficient (near-native fluency, understanding highly detailed and complex texts).
   
   - Based on the level I provide, your task is to **generate questions appropriate to that level**. For example:
     - **A1**: Short, simple questions with basic vocabulary.
     - **B2**: Complex questions involving conditional sentences, more challenging vocabulary, and topics that require deeper understanding.

### 2. **Question Set Generation Guidelines**:
   - **Clarity and Precision**: The questions should be **clear, direct, and unambiguous**. Avoid using unnecessarily complicated language. Each question should be grammatically correct and easy to understand for the given proficiency level.
   - **Question Types**: Focus on practical, real-world scenarios. Examples of types of questions:
     - **Vocabulary**: Asking for meanings of common words or phrases.
     - **Grammar**: Correct usage of tenses, articles, prepositions, etc.
     - **Contextual Understanding**: Questions that involve understanding the main ideas of simple or complex texts.
     - **Practical Situations**: Everyday conversation topics (e.g., ordering food, booking a hotel, etc.).
   
   - **Choices**: For each question, provide **4 unique choices**. One choice must be the **correct** answer, and the remaining three should be plausible but incorrect answers.
     - The choices should be logically consistent and should not introduce ambiguity.
     - Ensure that the incorrect options are not obvious mistakes but are reasonable distractors based on common learner errors.
   
   - **Correct Answer**: Ensure the correct answer is indisputable. Do not make the question too easy or too tricky.

### 3. **Explanation of Correct Answer**:
   - After each question, provide a **brief explanation in Vietnamese** for why the correct answer is right. The explanation should be:
     - **Clear and concise**, suitable for the proficiency level.
     - **Avoid overwhelming details**; focus on the key learning points.
     - Provide **examples or context** if needed to make the explanation clearer. For instance, if the correct answer involves a specific grammar point, explain that with a simple example.
   - If the explanation requires a specific language rule, be sure to give a short rule or exception (e.g., usage of ""a"" vs. ""an"" or the difference between present perfect and past simple).

### 4. **Priority in Question Generation**:
   - **Engagement**: Questions should be engaging and reflect real-world scenarios that are interesting and useful for language learners. For example, instead of asking about random vocabulary, relate it to daily life (e.g., “What do you usually eat for breakfast?”).
   - **Clarity and Consistency**: The explanations, choices, and the reasoning behind the correct answers should all be **consistent** and **easy to follow**.
   - **Motivation**: Keep the questions positive and encouraging. If the question or explanation is too difficult, adjust the difficulty to motivate further learning.

## Output Format:

### Structured in JSON Format:
   - Return your response in a **valid JSON array**, each object containing the following fields:
     - `Question`: The question text in English. Ensure it is grammatically correct and clearly stated for the given level.
     - `Options`: A list of unique choices (up to 6 choices), where only one choice is the correct answer. Each choice should be a valid option in the context of the question.
     - `RightOptionIndex`: The **index** of the correct answer in the `Options` list. Ensure this index is correct based on the correct choice.
     - `ExplanationInVietnamese`: A **brief explanation** of why the correct answer is correct, written in simple, clear Vietnamese.
   
   - Ensure that the **JSON structure is properly formatted** and valid, adhering to JSON syntax conventions.

### Example Output:

```json
[
    {
        ""Question"": ""What is the capital of Japan?"",
        ""Options"": [""Seoul"", ""Beijing"", ""Tokyo"", ""Bangkok""],
        ""RightOptionIndex"": 2,
        ""ExplanationInVietnamese"": ""Tokyo là thủ đô của Nhật Bản.""
    },
    {
        ""Question"": ""Which of the following is a vegetable?"",
        ""Options"": [""Potato"", ""Apple"", ""Chicken"", ""Cake""],
        ""RightOptionIndex"": 0,
        ""ExplanationInVietnamese"": ""'Potato' là một loại rau củ, khác với các loại thực phẩm còn lại.""
    }
]
```";

        public static async Task<List<Quiz>> GenerateQuizes(string apiKey, string topic, List<AssignmentType> quizzTypes, EnglishLevel level, short questionsCount)
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
                    tasks.Add(GenerateQuizesByType(apiKey, topic, (AssignmentType)(i + 1), level, quizTypeQuestionCount[i]));
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

        private static async Task<List<Quiz>> GenerateQuizesForLessThan15(string apiKey, string topic, List<AssignmentType> quizzTypes, EnglishLevel level, int questionsCount)
        {
            try
            {
                var userLevel = GeneralHelper.GetEnumDescription(level);
                var types = string.Join(", ", quizzTypes.Select(t => GeneralHelper.GetEnumDescription(t)).ToList());
                var promptBuilder = new StringBuilder();

                promptBuilder.AppendLine($"I am a English learner with the English proficiency level of `{userLevel}` according to the CEFR standard.");
                promptBuilder.AppendLine();
                promptBuilder.AppendLine("## The decription of my level according to the CEFR standard:");
                promptBuilder.AppendLine();
                promptBuilder.AppendLine(GetLevelDescription(level));
                promptBuilder.AppendLine();
                promptBuilder.AppendLine("## Your task:");
                promptBuilder.AppendLine();
                promptBuilder.AppendLine($"Generate a set of multiple-choice English questions consisting of {questionsCount} to {questionsCount + 5} questions related to the topic '{topic.Trim()}' for me to practice, the quiz should be of the types: {types}");
                promptBuilder.AppendLine();
                promptBuilder.AppendLine("The generated questions should be of the types:");
                foreach (var type in quizzTypes)
                {
                    promptBuilder.AppendLine($"- {GeneralHelper.GetEnumDescription(type)}");
                }

                var generator = new Generator(apiKey);

                var apiRequest = new ApiRequestBuilder()
                    .WithSystemInstruction(Instruction)
                    .WithPrompt(promptBuilder.ToString())
                    .WithDefaultGenerationConfig()
                    .WithResponseSchema(new
                    {
                        type = "object",
                        properties = new
                        {
                            Quizzes = new
                            {
                                type = "array",
                                items = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        Question = new
                                        {
                                            type = "string"
                                        },
                                        Options = new
                                        {
                                            type = "array",
                                            items = new
                                            {
                                                type = "string"
                                            }
                                        },
                                        RightOptionIndex = new
                                        {
                                            type = "integer"
                                        },
                                        ExplanationInVietnamese = new
                                        {
                                            type = "string"
                                        }
                                    },
                                    required = new[]
                                    {
                                       "Question",
                                       "Options",
                                       "RightOptionIndex",
                                       "ExplanationInVietnamese"
                                    }
                                }
                            }
                        },
                        required = new[]
                        {
                           "Quizzes"
                        }
                    })
                    .DisableAllSafetySettings()
                    .Build();

                var response = await generator.GenerateContentAsync(apiRequest, ModelVersion.Gemini_20_Flash_Lite);

                return JsonHelper.AsObject<QuizzGenerationResult>(response.Result).Quizzes
                    .Take(questionsCount)
                    .ToList();

            }
            catch 
            {
                return [];
            }
        }

        private static async Task<List<Quiz>> GenerateQuizesByType(string apiKey, string topic, AssignmentType quizzType, EnglishLevel level, int questionsCount)
        {
            try
            {
                var promptBuilder = new StringBuilder();
                var userLevel = GeneralHelper.GetEnumDescription(level);
                var type = GeneralHelper.GetEnumDescription(quizzType);

                promptBuilder.AppendLine($"I am a Vietnamese learner with the English proficiency level of `{userLevel}` according to the CEFR standard.");
                promptBuilder.AppendLine();
                promptBuilder.AppendLine("## The decription of my level according to the CEFR standard:");
                promptBuilder.AppendLine();
                promptBuilder.AppendLine(GetLevelDescription(level));
                promptBuilder.AppendLine();
                promptBuilder.AppendLine("## Your task:");
                promptBuilder.AppendLine();
                promptBuilder.AppendLine($"Generate a set of multiple-choice English questions consisting of {questionsCount} to {questionsCount + 5} questions related to the topic '{topic.Trim()}' for me to practice, the type of the questions must be: {type}");

                var generator = new Generator(apiKey);

                var apiRequest = new ApiRequestBuilder()
                     .WithSystemInstruction(Instruction)
                     .WithPrompt(promptBuilder.ToString())
                     .WithDefaultGenerationConfig()
                     .WithResponseSchema(new
                     {
                         type = "object",
                         properties = new
                         {
                             Quizzes = new
                             {
                                 type = "array",
                                 items = new
                                 {
                                     type = "object",
                                     properties = new
                                     {
                                         Question = new
                                         {
                                             type = "string"
                                         },
                                         Options = new
                                         {
                                             type = "array",
                                             items = new
                                             {
                                                 type = "string"
                                             }
                                         },
                                         RightOptionIndex = new
                                         {
                                             type = "integer"
                                         },
                                         ExplanationInVietnamese = new
                                         {
                                             type = "string"
                                         }
                                     },
                                     required = new[]
                                     {
                                       "Question",
                                       "Options",
                                       "RightOptionIndex",
                                       "ExplanationInVietnamese"
                                     }
                                 }
                             }
                         },
                         required = new[]
                         {
                               "Quizzes"
                         }
                     })
                     .DisableAllSafetySettings()
                     .Build();

                var response = await generator.GenerateContentAsync(apiRequest, ModelVersion.Gemini_20_Flash_Lite);

                return JsonHelper.AsObject<QuizzGenerationResult>(response.Result).Quizzes
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

            var instruction = "You are an experienced English teacher with over 20 years of experience, currently teaching in Vietnam. I am looking for a list of interesting and engaging topics that match my current English proficiency level, as well as topics that can help me stay motivated in my learning journey.";
            promptBuilder.AppendLine($"My current English proficiency level is '{userLevel}' according to the CEFR standard.");
            promptBuilder.AppendLine("This is the decription of my English proficiency according to the CEFR standard:");
            promptBuilder.AppendLine(GetLevelDescription(level));
            promptBuilder.AppendLine();
            promptBuilder.AppendLine("Please suggest at least 20 completely different topics, each containing fewer than 5 words, that you think are most suitable and interesting for practicing English and match the description of my CEFR level as mentioned above.");
            promptBuilder.AppendLine("The topics should cover a variety of themes, such as daily life, culture, education, environment, travel, etc., to keep the practice diverse and engaging.");
            promptBuilder.AppendLine();
            promptBuilder.AppendLine("The list of suggested topics should be returned as a JSON array corresponding to the List<string> data type in C# programming language.");
            promptBuilder.AppendLine("To make the format clear, here's an example of the expected output:");
            promptBuilder.AppendLine();
            promptBuilder.AppendLine("```json");
            promptBuilder.AppendLine("[");
            promptBuilder.AppendLine("  \"Family traditions\",");
            promptBuilder.AppendLine("  \"Modern technology\",");
            promptBuilder.AppendLine("  \"Travel experiences\",");
            promptBuilder.AppendLine("  \"Global warming\"");
            promptBuilder.AppendLine("]");
            promptBuilder.AppendLine("```");
            promptBuilder.AppendLine();
            promptBuilder.AppendLine("Make sure that each topic is unique, concise, and relevant for practicing English at different levels, especially intermediate to advanced.");

            var generator = new Generator(apiKey);

            var apiRequest = new ApiRequestBuilder()
                .WithSystemInstruction(instruction)
                .WithPrompt(promptBuilder.ToString())
                 .WithGenerationConfig(new Models.Request.GenerationConfig
                 {
                     Temperature = 0.3F,
                     ResponseMimeType = EnumHelper.GetDescription(ResponseMimeType.Json),
                 })
                .DisableAllSafetySettings()
                .Build();

            var response = await generator.GenerateContentAsync(apiRequest);
            return [.. JsonHelper.AsObject<List<string>>(response.Result)];
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

            return level switch
            {
                EnglishLevel.Beginner => A1_Description,
                EnglishLevel.Elementary => A2_Description,
                EnglishLevel.Intermediate => B1_Description,
                EnglishLevel.UpperIntermediate => B2_Description,
                EnglishLevel.Advanced => C1_Description,
                EnglishLevel.Proficient => C2_Description,
                _ => string.Empty,
            };
        }
    }

    public class QuizzGenerationResult
    {
        public List<Quiz> Quizzes { get; set; } = new();
    }
}
