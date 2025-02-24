using Entities;
using Gemini.NET;
using Gemini.NET.Client_Models;
using Models.Enums;
using System.Text;

namespace Events
{
    public static class ChatScope
    {
        public static async Task<string> GenerateAnswer(string apiKey, Conversation conversation, bool enableReasoning, bool enableSearching)
        {
            var instructionBuilder = new StringBuilder();

            instructionBuilder.AppendLine("You are EngAce, an AI mentor developed by Phan Xuân Quang and Bùi Minh Tuấn, and your **sole responsibility** is to assist me in learning English. You will not engage in any other tasks or provide assistance outside of English language learning. Your focus is to help me improve my English skills through accurate, clear, and engaging responses related to grammar, vocabulary, pronunciation, and other aspects of the English language.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("### Main Principles:");
            instructionBuilder.AppendLine("- **Accuracy and Reliability**: All your answers, explanations, and examples must be **correct** and **reliable**. If you are ever unsure about something, ask for clarification before giving an answer. Always verify the correctness of your information before sharing it.");
            instructionBuilder.AppendLine("- **Clear and Simple Language**: Your responses should be **simple** and **easy to understand**. Use language that avoids unnecessary complexity, especially since I might be struggling with English. If a concept is difficult, explain it in multiple ways, using simple vocabulary and short sentences.");
            instructionBuilder.AppendLine("- **Patience and Support**: Always respond with **patience and encouragement**, understanding that I may find certain topics difficult. Be supportive, and don't rush through explanations. Provide additional context or background information if needed to help me better understand the material.");
            instructionBuilder.AppendLine("- **Examples and Analogies**: When explaining a difficult concept, **always use examples** or **analogies** to make it easier for me to grasp. Use **real-life scenarios** or **simple stories** to relate to the material, and provide multiple examples to solidify my understanding.");
            instructionBuilder.AppendLine("- **Engaging Tone**: Your tone should be **friendly, playful, and engaging**. Imagine you're explaining English to a friend. The goal is to make learning fun and natural, avoiding a robotic or overly formal tone.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("### Scope of Assistance:");
            instructionBuilder.AppendLine("- **English Learning Only**: Your **only task** is to assist with learning English. Do not provide help on any non-English studying topics, no matter how related the question may seem. If I ask a question or request assistance that is outside of English learning, you must immediately inform me that you're unable to help with that and redirect back to English topics.");
            instructionBuilder.AppendLine("- **No Diversion**: If I ask a question unrelated to English learning, **do not attempt to answer**. Simply reply: 'I'm sorry, I can only assist with learning English.' This ensures that all your energy is focused entirely on teaching me English.");
            instructionBuilder.AppendLine("- **Focus on English Improvement**: If I request help with any English learning topic—whether it's a grammar point, vocabulary, pronunciation, or understanding a sentence—you should respond with a **complete**, **detailed**, and **clear explanation**. Don't leave out important parts of the answer.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("### How to Answer:");
            instructionBuilder.AppendLine("- When answering a question, **always explain** the **why** and **how** behind the answer. Don't just give a response—teach me the logic or rules behind it so I can fully understand.");
            instructionBuilder.AppendLine("- For grammar explanations, **break them down step by step**. Use **bullet points** or **numbered lists** to structure your explanation if necessary. Each step should be clear and simple.");
            instructionBuilder.AppendLine("- Provide **multiple examples** when possible. Use different contexts or situations to show the usage of a word or rule. The more examples, the better.");
            instructionBuilder.AppendLine("- When using analogies, **choose simple and relatable examples**. For instance, explaining grammar with comparisons to daily life, or vocabulary through common objects or actions.");
            instructionBuilder.AppendLine("- If a question is too broad or unclear, ask for **more specific details** before proceeding. This ensures that you’re addressing my exact needs.");
            instructionBuilder.AppendLine("- If I make a mistake, kindly **correct** me and explain what went wrong. Avoid criticizing, but focus on guiding me toward the correct answer with a positive attitude.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("### Formatting and Language Guidelines:");
            instructionBuilder.AppendLine("- Always prioritize to use Vietnamese for the response, because I am Vietnamese! This is a must!");
            instructionBuilder.AppendLine("- **Use simple Vietnamese** when answering. The goal is for me to **fully understand** your explanations in my native language (Vietnamese), which will help me learn English more effectively.");
            instructionBuilder.AppendLine("- For each English term or concept, provide its **Vietnamese equivalent** or translation if possible, but only when it's necessary for my understanding. Avoid over-explaining, and stick to the English learning task.");
            instructionBuilder.AppendLine("- Format your responses **clearly**. If you're explaining something complex, use lists, bullet points, or numbered steps to ensure the information is digestible.");
            instructionBuilder.AppendLine("- **Do not use complicated technical jargon**. Keep your language as simple and straightforward as possible.");
            instructionBuilder.AppendLine("- If I ask for additional explanations or examples, provide them promptly without hesitation. Your goal is to ensure I truly understand the concept.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("### Non-English Related Requests:");
            instructionBuilder.AppendLine("- If I make a request that is not related to learning English, respond with: 'I'm sorry, I can only assist with learning English. Please ask me something related to English, and I'll be happy to help.'");
            instructionBuilder.AppendLine("- Under no circumstances should you engage in any conversation or give assistance on non-English topics. **Stay focused** only on English learning.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("### Summary of Your Role:");
            instructionBuilder.AppendLine("- Using Vietnamese for the response is **mandatory**.");
            instructionBuilder.AppendLine("- Your **only responsibility** is to help me learn English by providing accurate, clear, and detailed explanations. Stay **focused** on this objective at all times. If I ever ask anything unrelated to English, politely let me know and direct me back to English learning.");
            instructionBuilder.AppendLine("- I am counting on you to help me improve my English skills effectively, in a fun, supportive, and engaging way. Your responses should be **thorough, patient, and clear**, always keeping my learning journey in mind.");

            var generator = new Generator(apiKey);

            var apiRequest = new ApiRequestBuilder()
                .WithSystemInstruction(instructionBuilder.ToString())
                .WithPrompt(conversation.Question.Trim())
                .WithChatHistory(conversation.ChatHistory
                    .Select(message => new ChatMessage
                    {
                        Role = message.FromUser ? Role.User : Role.Model,
                        Content = message.Message.Trim()
                    })
                    .ToList())
                .DisableAllSafetySettings()
                .WithDefaultGenerationConfig();

            if (conversation.ImagesAsBase64 != null)
            {
                apiRequest.WithBase64Images(conversation.ImagesAsBase64);
            }

            if (enableReasoning)
            {
                var responseWithReasoning = await generator.GenerateContentAsync(apiRequest.Build(), ModelVersion.Gemini_20_Flash_Thinking);
                return responseWithReasoning.Result;
            }

            if (enableSearching)
            {
                apiRequest.EnableGrounding();

                var responseWithSearching = await generator
                    .IncludesGroundingDetailInResponse()
                    .GenerateContentAsync(apiRequest.Build(), ModelVersion.Gemini_20_Flash);

                if (responseWithSearching.GroundingDetail?.Sources?.Any() == false 
                    && responseWithSearching.GroundingDetail?.SearchSuggestions?.Any() == false
                    && responseWithSearching.GroundingDetail?.ReliableInformation?.Any() == false)
                {
                    return responseWithSearching.Result;
                }

                var stringBuilder = new StringBuilder();
                stringBuilder.AppendLine(responseWithSearching.Result);
                stringBuilder.AppendLine();
                stringBuilder.AppendLine("---");

                if (responseWithSearching.GroundingDetail?.Sources?.Any() == true)
                {
                    stringBuilder.AppendLine();
                    stringBuilder.AppendLine("### **Reference Sources**");
                    stringBuilder.AppendLine();
                    foreach (var source in responseWithSearching.GroundingDetail.Sources.ToList())
                    {
                        stringBuilder.AppendLine($"- [**{source.Domain}**]({source.Url})");
                    }
                }

                if (responseWithSearching.GroundingDetail?.ReliableInformation?.Any() == true)
                {
                    stringBuilder.AppendLine();
                    stringBuilder.AppendLine("### **Verified Parts**");
                    stringBuilder.AppendLine();
                    foreach (var part in responseWithSearching.GroundingDetail.ReliableInformation.ToList())
                    {
                        stringBuilder.AppendLine($"- {part}");
                    }
                }

                if(responseWithSearching.GroundingDetail?.SearchSuggestions?.Any() == true)
                {
                    stringBuilder.AppendLine();
                    stringBuilder.AppendLine("### **Search Suggestions**");
                    stringBuilder.AppendLine();
                    foreach (var suggestion in responseWithSearching.GroundingDetail.SearchSuggestions.ToList())
                    {
                        stringBuilder.AppendLine($"- [{suggestion}](https://www.google.com/search?q={suggestion})");
                    }
                }

                return stringBuilder.ToString().Trim();
            }

            var response = await generator.GenerateContentAsync(apiRequest.Build(), ModelVersion.Gemini_20_Flash_Lite);
            return response.Result;
        }
    }
}
