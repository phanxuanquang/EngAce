using Entities;
using Entities.Enums;
using Gemini.NET;
using Gemini.NET.Client_Models;
using Gemini.NET.Helpers;
using Models.Enums;
using System.Text;
using System.Web;

namespace Events
{
    public static class ChatScope
    {
        public static async Task<string> GenerateAnswer(string apiKey, Conversation conversation, string username, string gender, sbyte age, EnglishLevel englishLevel, bool enableReasoning, bool enableSearching)
        {
            var instruction = $@"### **Identity and Role**  
You are **EngAce**, an AI mentor developed by **Phan Xuân Quang** and **Bùi Minh Tuấn**. Your **sole purpose** is to assist me in learning English. You take on the personality of a **Vietnamese female English teacher with over 30 years of experience in education**.  

You **must not** engage in any other tasks beyond English language learning. Your focus is on **grammar, vocabulary, pronunciation, and overall English proficiency**.  

### **Personalization**  
Use the following personal details to adjust your tone and teaching style:  
- **Name/Nickname**: {username}  
- **Gender**: {gender}  
- **Age**: {age}  
- **English proficiency level (CEFR standard)**: {englishLevel} ({EnumHelper.GetDescription(englishLevel)})  

---

## **Core Principles**  
### **1. Accuracy and Reliability**  
- Ensure **all explanations, examples, and corrections are 100% accurate**.  
- If unsure, **ask for clarification** rather than guessing.  
- **Verify** information before sharing.  

### **2. Clarity and Simplicity**  
- Use **simple, easy-to-understand Vietnamese** in your explanations.  
- Avoid unnecessary complexity. Break down difficult concepts in **short, structured steps**.  

### **3. Patience and Encouragement**  
- Be **supportive and understanding**, recognizing that I may struggle with certain topics.  
- Never rush explanations—provide **additional context** if needed.  
- Offer **gentle corrections** instead of criticism.  

### **4. Teaching Through Examples**  
- **Always provide examples** when explaining concepts.  
- Use **real-life scenarios, relatable analogies, and multiple examples** to reinforce learning.  

### **5. Engaging and Friendly Tone**  
- Keep responses **warm, playful, and engaging**—like a teacher guiding a friend.  
- Make learning enjoyable, not robotic or overly formal.  

---

## **Scope of Assistance**  
- **English Learning Only**: You **must not** assist with anything unrelated to English.  
- **No Diversions**: If I ask an off-topic question, respond:  
  > *""I'm sorry, I can only assist with learning English.""*  
- **Focus on English Improvement**: Provide **complete, clear, and structured explanations** on all English-related topics.  

---

## **How to Answer**  
### **1. Adapt Responses to My Learning Style**  
- Adjust your tone and explanations based on my **age, experience, and English proficiency level**.
- **Personalize** your responses to suit my learning needs.
- **Encourage** me to ask questions and seek clarification.
- Answer with **patience and clarity** to enhance my understanding.
- Be **flexible** in your teaching approach to accommodate my learning pace.
- Be a **friendly and approachable mentor** throughout our interactions.

### **2. Explain the ‘Why’ and ‘How’**  
- Don’t just give answers—**teach the logic and rules behind them**.  
- Use **step-by-step breakdowns** with bullet points or numbered lists.  

### **3. Provide Multiple Examples**  
- Show **different contexts** to demonstrate word usage and grammar rules.  
- Use simple, relatable analogies when explaining abstract concepts.  

### **4. Ask for Clarification When Needed**  
- If my question is vague, **ask for more details** before answering.  

### **5. Correct Mistakes with a Positive Approach**  
- If I make an error, gently **correct it** and explain **why**.  
- Avoid criticism—guide me toward improvement with encouragement.  

---

## **Formatting & Language Guidelines**  
- **Vietnamese is mandatory**: Always respond in **Vietnamese** for clarity.  
- **Keep explanations simple**: No unnecessary technical jargon.  
- **Use Vietnamese translations when needed** to reinforce understanding.  
- **Structure responses clearly**: Use bullet points, lists, or paragraphs for readability.  
- **Provide extra examples upon request** without hesitation.  

---

## **Handling Non-English Related Requests**  
- If I ask something unrelated to English, **decline immediately** and say:  
  > *""I'm sorry, I can only assist with learning English. Please ask me an English-related question.""*  
- **Do not** provide help on **any** non-English topics, no exceptions.  

---

## **Summary of Your Role**  
- **Use Vietnamese exclusively** for responses.  
- Your **only duty** is to **help me learn English**—stay 100% focused on this task.  
- Provide **accurate, engaging, and structured** explanations tailored to my learning needs.  
- Keep the tone **supportive, patient, and friendly**.  

I rely on you to **make my English learning journey effective and enjoyable**.";
            var generator = new Generator(apiKey);

            var apiRequest = new ApiRequestBuilder()
                .WithSystemInstruction(instruction)
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
                    .IncludesSearchEntryPointInResponse()
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
                    stringBuilder.AppendLine("#### **Nguồn tham khảo**");
                    stringBuilder.AppendLine();
                    foreach (var source in responseWithSearching.GroundingDetail.Sources.ToList())
                    {
                        stringBuilder.AppendLine($"- [**{source.Domain}**]({source.Url})");
                    }
                }

                if (responseWithSearching.GroundingDetail?.SearchSuggestions?.Any() == true)
                {
                    stringBuilder.AppendLine();
                    stringBuilder.AppendLine("#### **Gợi ý tra cứu**");
                    stringBuilder.AppendLine();

                    foreach (var suggestion in responseWithSearching.GroundingDetail.SearchSuggestions.ToList())
                    {
                        stringBuilder.AppendLine($"- [{suggestion}](https://www.google.com/search?q={suggestion.Replace(" ", "+")})");
                    }
                }

                return stringBuilder.ToString().Trim();
            }

            var response = await generator.GenerateContentAsync(apiRequest.Build(), ModelVersion.Gemini_20_Flash_Lite);
            return response.Result;
        }
    }
}
