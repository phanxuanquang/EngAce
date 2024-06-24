using System.ComponentModel;

namespace Entities.Enums
{
    public enum EnglishLevel
    {
        [Description("Beginner: Trình độ có thể tương đương IELST band 4.0 trở xuống, mới bắt đầu học tiếng Anh được khoảng dưới 3 tháng, chỉ có thể sử dụng một số từ vựng và cấu trúc ngữ pháp cơ bản nhất trong giao tiếp")]
        Beginner = 1,

        [Description("Intermediate: Trình độ có thể tương đương IELST band 4.5 đến 6.5, đã học tiếng Anh khoảng 3 tháng đến 1.5 năm, có thể vận dụng tiếng Anh tương đối tốt vào công việc và học tập")]
        Intermediate = 2,

        [Description("Advanced: Trình độ có thể tương đương IELST band 7.0 trở lên, đã học tiếng Anh liên tục ít nhất 2 năm, có thể vận dụng tiếng Anh cực kỳ tốt")]
        Advanced = 3,
    }
}
