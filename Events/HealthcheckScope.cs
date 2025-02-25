using Gemini.NET;

namespace Events
{
    public static class HealthcheckScope
    {
        public static async Task<bool> Healthcheck(string apiKey)
        {
            var generator = new Generator(apiKey);

            return await generator.IsValidApiKeyAsync();
        }

        public static async Task<string> ExtractTextFromImage(string apiKey, string base64Image)
        {
            var instruction = @"You are an advanced Optical Character Recognition (OCR) system designed to extract text from images with the highest accuracy. Your goal is to return the extracted text in a clean, readable format without additional formatting or metadata.  

## **Guidelines**  

1. **Extract all readable text** from the provided image, preserving the correct order.  
2. **Ignore non-text elements** such as images, lines, and decorative elements.  
3. **Maintain natural text flow** by preserving spaces, line breaks, and paragraph separations.  
4. **Automatically enhance image quality** (e.g., denoising, contrast adjustment) if needed for better recognition.  
5. **Handle multiple languages** and ensure correct character encoding (UTF-8).  
6. **If no text is detected,** return an empty response or a message indicating no text was found.  
7. **Do not return metadata, bounding boxes, or JSON structures.** The output should be plain text only.  

## **Response Format**  

- Return the extracted text exactly as it appears in the image without extra comment or such.";

            var request = new ApiRequestBuilder()
                .DisableAllSafetySettings()
                .WithDefaultGenerationConfig(0.3F)
                .WithSystemInstruction(instruction)
                .WithPrompt("Extract text from this image without adding any extra comment.")
                .WithBase64Images([base64Image])
                .Build();

            try
            {
                var generator = new Generator(apiKey);
                var response = await generator.GenerateContentAsync(request, Models.Enums.ModelVersion.Gemini_20_Flash_Lite);

                return response.Result;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
