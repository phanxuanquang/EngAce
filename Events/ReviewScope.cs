using Entities;
using Entities.Enums;
using Helper;
using Newtonsoft.Json;
using System.Text;

namespace Events
{
    public static class ReviewScope
    {
        public static async Task<Comment> GenerateReview(string apiKey, EnglishLevel level, string content)
        {
            string? result = null;
            var promptBuilder = new StringBuilder();
            var userLevel = GeneralHelper.GetEnumDescription(level);

            promptBuilder.Append("Bạn là một giáo viên tiếng Anh với hơn 20 năm kinh nghiệm giảng dạy, đồng thời đang làm việc tại một trung tâm dạy IELTS lớn. ");
            promptBuilder.Append($"Trình độ tiếng Anh của tôi theo tiêu chuẩn CEFR là '{userLevel}'. ");
            promptBuilder.Append("Tôi đang luyện tập kỹ năng writting và cần bạn góp ý để bài viết của tôi tốt hơn.");
            promptBuilder.Append("Mục tiêu của tôi là có thể viết những bài viết tiếng Anh thật hay và dễ hiểu cho mọi người đọc.");
            promptBuilder.AppendLine("Bạn hãy đọc bài viết của tôi rồi sau đó cho nhận xét và góp ý. ");
            promptBuilder.AppendLine("Nhận xét của bạn phải phù hợp với trình độ hiện tại của tôi, đồng thời phải thật dễ hiểu và thân thiện. ");
            promptBuilder.Append("Ngoài ra, tôi cũng cần bạn chỉ ra những lỗi sai hoặc những chỗ chưa tốt trong bài viết rồi đưa ra những cải thiện hợp lý, và bài viết sau khi được improve không được phép dài quá 1.5 lần độ dài bài viết ban đầu.");
            promptBuilder.AppendLine("Câu trả lời của bạn phải là một JSON object có schema như sau: ");
            promptBuilder.AppendLine("class ReviewerResponse");
            promptBuilder.AppendLine("{");
            promptBuilder.AppendLine("    string GeneralComment; // Nhận xét chung cho cả bài viết, bao gồm phát hiện lỗi ngữ pháp cơ bản và cung cấp giải thích chi tiết cho từng lỗi, đề xuất cách thay thế từ ngữ phù hợp hơn, chỉ ra những chính tả và gợi ý cách sửa lỗi chính xác, phân tích phong cách viết và đề xuất cách viết phù hợp với ngữ cảnh và đối tượng, phát hiện lỗi logic trong lập luận và gợi ý cách sửa để bài viết mạch lạc hơn, giải thích chi tiết cho các gợi ý sửa chữa để người dùng hiểu rõ và áp dụng hiệu quả.");
            promptBuilder.AppendLine("    string ImprovedContent; // Bài viết sau khi được chỉnh sửa để tốt hơn, nhớ highlight những đoạn được chỉnh sửa bằng cặp dấu **, nhưng tuyệt đối không được thay đổi nội dung chính của bài viết");
            promptBuilder.AppendLine("}");
            promptBuilder.AppendLine("Nội dung bài viết của tôi là: ");
            promptBuilder.AppendLine($"{content}");

            result = await Gemini.Generator.Generate(apiKey, promptBuilder.ToString(), true, 60, GenerativeModel.Gemini_15_Pro);
            return JsonConvert.DeserializeObject<Comment>(result);
        }
    }
}
