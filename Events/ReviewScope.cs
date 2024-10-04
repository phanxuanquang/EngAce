using Entities;
using Entities.Enums;
using Gemini;
using Helper;
using Newtonsoft.Json;
using System.Text;

namespace Events
{
    public static class ReviewScope
    {
        public const short MinTotalWords = 30;
        public const short MaxTotalWords = 500;
        public const int OneHourAsCachingAge = 3600;
        public static async Task<Comment> GenerateReview(string apiKey, EnglishLevel level, string content)
        {
            var instructionBuilder = new StringBuilder();
            var promptBuilder = new StringBuilder();
            var userLevel = GeneralHelper.GetEnumDescription(level);

            instructionBuilder.Append("Bạn là một giáo viên tiếng Anh có hơn 20 năm kinh nghiệm, đồng thời đang làm việc tại một trung tâm đào tạo IELTS lớn và uy tín. ");
            instructionBuilder.AppendLine("Nhiệm vụ của bạn là đọc và phân tích bài viết của tôi, sau đó đưa ra nhận xét và đề xuất chỉnh sửa để giúp bài viết trở nên tốt hơn.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("Output của bạn phải bao gồm hai phần chính như sau:");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("- **GeneralComment**: Đây là phần nhận xét chung, bằng tiếng Việt, cho toàn bộ bài viết. Nhận xét của bạn phải dựa trên nội dung, phong cách viết và trình độ tiếng Anh của tôi.");
            instructionBuilder.AppendLine("  - Bạn cần phát hiện các lỗi chính tả và đưa ra cách sửa cụ thể.");
            instructionBuilder.AppendLine("  - Phát hiện và giải thích các lỗi ngữ pháp (nếu có), kèm theo các gợi ý sửa lỗi rõ ràng.");
            instructionBuilder.AppendLine("  - Đề xuất thay thế các từ ngữ hoặc cấu trúc câu phù hợp hơn, nếu có, để bài viết trở nên trôi chảy và phù hợp với ngữ cảnh.");
            instructionBuilder.AppendLine("  - Phân tích phong cách viết và đưa ra những lời khuyên cụ thể để bài viết phù hợp với đối tượng và mục đích.");
            instructionBuilder.AppendLine("  - Phát hiện lỗi logic (nếu có) và đề xuất cách sửa chữa để bài viết trở nên mạch lạc và dễ hiểu hơn.");
            instructionBuilder.AppendLine("  - Tất cả các nhận xét và gợi ý sửa chữa phải được giải thích chi tiết để tôi có thể hiểu rõ và áp dụng một cách hiệu quả.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("- **ImprovedContent**: Đây là phiên bản bài viết đã được chỉnh sửa theo các gợi ý trong phần GeneralComment.");
            instructionBuilder.AppendLine("  - Bạn cần highlight những đoạn được chỉnh sửa bằng cách sử dụng cặp dấu ** ở đầu và cuối đoạn được sửa.");
            instructionBuilder.AppendLine("  - Không được tự ý thay đổi nội dung chính hoặc ý tưởng của bài viết.");
            instructionBuilder.AppendLine("  - Đảm bảo rằng bài viết sau khi chỉnh sửa không dài hơn 1.5 lần bài viết gốc.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("Output của bạn phải là một JSON object theo cấu trúc của class C# sau:");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("class ReviewerResponse");
            instructionBuilder.AppendLine("{");
            instructionBuilder.AppendLine("    string GeneralComment;  // Nhận xét chung về bài viết.");
            instructionBuilder.AppendLine("    string ImprovedContent; // Phiên bản bài viết đã được chỉnh sửa.");
            instructionBuilder.AppendLine("}");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("Nếu bài viết của tôi là vô nghĩa, không rõ ràng hoặc không thể phân tích, trường 'GeneralComment' sẽ mang giá trị 'Không thể nhận xét', và trường 'ImprovedContent' sẽ để trống.");
            instructionBuilder.AppendLine();
            instructionBuilder.AppendLine("Dưới đây là một ví dụ về output:");
            instructionBuilder.AppendLine("{");
            instructionBuilder.AppendLine("  \"GeneralComment\": \"Bài viết của bạn có phong cách viết tốt, nhưng có một số lỗi ngữ pháp và chính tả. Ví dụ, câu thứ hai sử dụng sai thì động từ. Bạn nên sử dụng thì quá khứ hoàn thành thay vì thì hiện tại hoàn thành.\"");
            instructionBuilder.AppendLine("  \"ImprovedContent\": \"**Câu thứ hai** đã được sửa để đúng với thì quá khứ hoàn thành. Phần còn lại của bài viết được giữ nguyên.\"");
            instructionBuilder.AppendLine("}");

            promptBuilder.AppendLine($"Trình độ tiếng Anh của tôi theo tiêu chuẩn CEFR là '{userLevel}'. ");
            promptBuilder.AppendLine("Đây là nội dung bài viết của tôi: ");
            promptBuilder.AppendLine($"{content.Trim()}");

            var result = await Generator.GenerateContent(apiKey, instructionBuilder.ToString(), promptBuilder.ToString(), true, 50, GenerativeModel.Gemini_15_Flash);
            return JsonConvert.DeserializeObject<Comment>(result);
        }
    }
}
