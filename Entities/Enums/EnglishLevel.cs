using System.ComponentModel;

namespace Entities.Enums
{
    public enum EnglishLevel
    {
        [Description("<strong>Beginner:</strong> Hiểu và sử dụng các cụm từ đơn giản hàng ngày và các câu cơ bản, có thể tự giới thiệu và trả lời câu hỏi về thông tin cá nhân")]
        Beginner = 1,

        [Description("<strong>Elementary:</strong> Hiểu câu từ thông dụng liên quan đến những kiến thức xã hội cơ bản, có thể giao tiếp trong các tình huống đơn giản và thường nhật")]
        Elementary = 2,

        [Description("<strong>Intermediate:</strong> Hiểu ý chính khi giao tiếp về các chủ đề quen thuộc trong đời sống, có thể xử lý hầu hết các tình huống phát sinh trong sinh hoạt")]
        Intermediate = 3,

        [Description("<strong>Upper Intermediate:</strong> Hiểu ý chính trong các văn bản phức tạp cả về chủ đề cụ thể và trừu tượng, có thể tương tác với người bản xứ tương đối suông sẻ")]
        UpperIntermediate = 4,

        [Description("<strong>Advanced:</strong> Hiểu nhiều văn bản dài và phức tạp và ý nghĩa tiềm ẩn bên trong, có thể diễn đạt lưu loát và tự nhiên mà không cần tra cứu nhiều")]
        Advanced = 5,

        [Description("<strong>Proficient:</strong> Hiểu hầu hết mọi thứ nghe và đọc được, có thể tóm tắt thông tin từ các nguồn nói và viết khác nhau")]
        Proficient = 6,
    }
}
