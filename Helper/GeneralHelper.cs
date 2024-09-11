using System.ComponentModel;
using System.Reflection;

namespace Helper
{
    public static class GeneralHelper
    {
        public static string GetEnumDescription(Enum value)
        {
            FieldInfo fi = value.GetType().GetField(value.ToString());
            DescriptionAttribute[] attributes = (DescriptionAttribute[])fi.GetCustomAttributes(typeof(DescriptionAttribute), false);

            if (attributes != null && attributes.Length > 0)
            {
                return attributes[0].Description;
            }
            else
            {
                return value.ToString();
            }
        }

        public static ushort GetTotalWords(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return 0;
            }

            char[] delimiters = { ' ', '\r', '\n', '\t', '.', ',', ';', ':', '!', '?' };

            string[] words = input.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);

            return (ushort)words.Length;
        }

        public static bool IsEnglish(string input)
        {
            char[] englishAlphabetAndPunctuation = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?;:'\"()[]{}$%&*+-/".ToCharArray();

            return input.All(c => englishAlphabetAndPunctuation.Contains(c) || char.IsWhiteSpace(c) || char.IsDigit(c));
        }

        public static List<int> GenerateRandomNumbers(int x, int y)
        {
            // Nếu số phần tử lớn hơn tổng hoặc tổng nhỏ hơn x thì không thể tạo ra danh sách hợp lệ.
            if (x > y)
            {
                throw new ArgumentException("Không thể tạo danh sách có tổng bằng y với số phần tử lớn hơn y.");
            }

            // Khởi tạo danh sách
            var rand = new Random();
            var result = new List<int>();

            // Bắt đầu bằng cách gán giá trị 1 cho mỗi phần tử để đảm bảo chúng đều là số dương
            int sum = x; // Tối thiểu mỗi phần tử là 1, do đó tổng ban đầu là x.
            for (int i = 0; i < x; i++)
            {
                result.Add(1); // Tạo x phần tử đều bằng 1
            }

            // Phân phối phần còn lại (y - x) vào các phần tử ngẫu nhiên trong danh sách
            int remaining = y - x;

            while (remaining > 0)
            {
                // Chọn ngẫu nhiên một chỉ số để tăng giá trị
                int index = rand.Next(0, x);
                result[index]++;
                remaining--;
            }

            return result;
        }
    }
}
