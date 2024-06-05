using Entities;
using Gemini_API_Helper;
using Newtonsoft.Json;

namespace Functions
{
    public static class QuizScope
    {
        public static async Task<List<Quiz>> GenerateQuizes(string topic, bool useJsonResponse = true, double creativeLevel = 25, EnumModel model = EnumModel.Gemini_10_Pro)
        {
            var apiResponse = await Helper.GenerateContent(topic, useJsonResponse, creativeLevel, model);
            try
            {
                return JsonConvert.DeserializeObject<List<Quiz>>(apiResponse);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
