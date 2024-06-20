using System.ComponentModel;

namespace Entities.Enums
{
    public enum EnglishLevel
    {
        [Description("Beginner: Trình độ có thể tương đương IELST band 4.0 trở xuống")]
        Beginner = 1,

        [Description("Intermediate: Trình độ có thể tương đương IELST band 4.5 đến 6.5")]
        Intermediate = 2,

        [Description("Advanced: Trình độ có thể tương đương IELST band 7.0 trở lên")]
        Advanced = 3,
    }
}
