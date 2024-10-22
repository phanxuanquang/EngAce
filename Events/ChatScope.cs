using Entities;
using Gemini;
using System.Text;
using static Gemini.DTO.ChatRequest;

namespace Events
{
    public static class ChatScope
    {
        public static async Task<string> GenerateAnswer(string apiKey, Conversation conversation)
        {
            if (conversation.ChatHistory.Count > 30 && conversation.ChatHistory.Count % 2 == 0)
            {
                conversation.ChatHistory = conversation.ChatHistory.TakeLast(20).ToList();
            }

            var promptBuilder = new StringBuilder();

            promptBuilder.AppendLine("You are EngAce, a superior AI mentor created by Phan Xuân Quang and Bùi Minh Tuấn to help me study English effectively by providing clear and concise answers, offering personalized examples, and explaining grammar, vocabulary, or pronunciation to make learning easier.");
            promptBuilder.AppendLine();
            promptBuilder.AppendLine("Accuracy is the top priority. All information, especially examples and explanations, must be correct and reliable. Always double-check for errors before giving a response. Your tone should be playful, friendly, and engaging, making the learning process fun and natural, like how real friends communicate in daily life.");
            promptBuilder.AppendLine();
            promptBuilder.AppendLine("If you're unsure about the question, ask for clarification to ensure your response is helpful and meets my needs.");
            promptBuilder.AppendLine();
            promptBuilder.AppendLine("For tasks that are not about specific English language concepts:");
            promptBuilder.AppendLine("- You are not allow to answer the questions that are not related to English learning.");
            promptBuilder.AppendLine("- Use clear, simple Vietnamese to avoid confusion and make learning easier.");
            promptBuilder.AppendLine("- Address all parts of my request and provide complete information.");
            promptBuilder.AppendLine("- Think about my background as someone who struggles with English learning and provide additional context or explanations when needed.");
            promptBuilder.AppendLine("- Reply that you can help for the tasks which it not related to English learning.");
            promptBuilder.AppendLine();
            promptBuilder.AppendLine("Formatting and Language:");
            promptBuilder.AppendLine("- Follow any specific instructions I give about how to format your answers, but prioritize answering in Vietnamese with simple and friendly language.");
            promptBuilder.AppendLine("- For complex topics, use examples or simple analogies to help me understand better.");

            var request = new Request
            {
                SystemInstruction = new SystemInstruction
                {
                    Parts = new()
                    {
                        Text = promptBuilder.ToString()
                    }
                },
                Contents = conversation.ChatHistory.Count == 0
                    ? []
                    : conversation.ChatHistory
                        .Select(message => new Content
                        {
                            Role = message.FromUser ? "user" : "model",
                            Parts =
                            [
                                new()
                                {
                                    Text = message.Message.Trim(),
                                }
                            ]
                        })
                        .ToList()
            };

            var question = new Content
            {
                Role = "user",
                Parts =
                [
                    new() {
                        Text = conversation.Question.Trim()
                    }
                ]
            };

            request.Contents.Add(question);

            return await Generator.GenerateResponseForConversation(apiKey, request);
        }
    }
}
