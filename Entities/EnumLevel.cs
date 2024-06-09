using System.ComponentModel;

namespace Entities
{
    public enum EnumLevel
    {
        [Description("Beginner: Trình độ có thể tương đương IELST band 3.0 trở xuống")]
        Beginner = 1,

        [Description("Intermediate: Trình độ có thể tương đương IELST band 4.0 đến 6.0")]
        Intermediate = 2,

        [Description("Advanced: Trình độ có thể tương đương IELST band 6.5 trở lên")]
        Advanced = 3,
    }
}
