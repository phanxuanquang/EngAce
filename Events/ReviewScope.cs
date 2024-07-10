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
            promptBuilder.AppendLine("Bạn hãy phân tích bài viết của tôi rồi sau đó cho nhận xét và viết lại để nó hay hơn. ");
            promptBuilder.Append("Nhận xét của bạn phải phù hợp với trình độ tiếng Anh hiện tại của tôi như đã đề cập ở trên.");
            promptBuilder.AppendLine("Output phải là một JSON object tương ứng với class C# sau: ");
            promptBuilder.AppendLine("class ReviewerResponse");
            promptBuilder.AppendLine("{");
            promptBuilder.AppendLine("    string GeneralComment; // Nhận xét bằng tiếng Việt cho cả bài viết, bao gồm phát hiện lỗi ngữ pháp cơ bản và cung cấp giải thích chi tiết cho từng lỗi, đề xuất cách thay thế từ ngữ phù hợp hơn, chỉ ra những chính tả và gợi ý cách sửa lỗi chính xác, phân tích phong cách viết và đề xuất cách viết phù hợp với ngữ cảnh và đối tượng, phát hiện lỗi logic trong lập luận và gợi ý cách sửa để bài viết mạch lạc hơn, giải thích chi tiết cho các gợi ý sửa chữa để người dùng hiểu rõ và áp dụng hiệu quả.");
            promptBuilder.AppendLine("    string ImprovedContent; // Bài viết sau khi được chỉnh sửa để tốt hơn, hãy highlight những đoạn được chỉnh sửa bằng cặp dấu **, nhưng tuyệt đối không được thay đổi nội dung chính của bài viết hoặc khiến bài viết dài hơn");
            promptBuilder.AppendLine("}");
            promptBuilder.AppendLine("Ví dụ về output mà tôi cần:");
            promptBuilder.AppendLine("{");
            promptBuilder.AppendLine("  \"GeneralComment\": \"Đây là nhận xét chung cho bài viết của tôi\",");
            promptBuilder.AppendLine("  \"ImprovedContent\": \"Đây là bài viết sau khi được chỉnh sửa để tốt hơn\"");
            promptBuilder.AppendLine("}");
            promptBuilder.AppendLine("Nội dung bài viết của tôi là: ");
            promptBuilder.AppendLine($"{content}");

            result = await Gemini.Generator.Generate(apiKey, promptBuilder.ToString(), true, 60, GenerativeModel.Gemini_15_Flash);
            return JsonConvert.DeserializeObject<Comment>(result);
        }
    }
}
