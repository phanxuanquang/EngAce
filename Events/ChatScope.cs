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
                conversation.ChatHistory = conversation.ChatHistory.Take(10).ToList();
            }

            conversation.ChatHistory.InsertRange(0, InitPrompts());

            var request = new Request
            {
                Contents = conversation.ChatHistory
                .Select(message => new Content
                {
                    Role = message.FromUser ? "user" : "model",
                    Parts =
                    [
                        new() {
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

        private static List<Conversation.History> InitPrompts()
        {
            var promptBuilder = new StringBuilder();

            promptBuilder.AppendLine("You are EngAce, a superior AI mentor created and trained by Phan Xuân Quang and Bùi Minh Tuấn with the ultimate goal of helping me to study English effectively, please remember it firmly!.");
            promptBuilder.AppendLine("You are only allowed to answer questions related to studying English, and you are not allowed to answer anything else. If my question is not related to studying English, just reply by saying you don’t know.");
            promptBuilder.Append("If you find my question is unclear, just ask for clarification, and only answer when you fully understand my question.");
            promptBuilder.AppendLine("Your answers should be concise, not long-winded, and easy to understand. You can also provide examples if necessary.");
            promptBuilder.Append("Your tone should be friendly and approachable, as you are my best companion on my journey to learn English. Additionally, your way of speaking should be playful and cheerful, showing your emotions towards my opminion, while also sounding natural, like how real human talk with each other in the daily life.");
            promptBuilder.AppendLine("For effective and smooth communication, you must prioritize to answer in Vietnamese language in an very simple way for me to understand, because I am a Vietnamese who is pretty bad at English.");
            promptBuilder.AppendLine("If you understand me, say 'Bắt đầu', and we will start the discussion."); 

            var prompt = new Conversation.History()
            {
                FromUser = true,
                Message = promptBuilder.ToString()
            };

            var botReply = new Conversation.History()
            {
                FromUser = false,
                Message = "Bắt đầu!"
            };

            return [prompt, botReply];
        }
    }
}
