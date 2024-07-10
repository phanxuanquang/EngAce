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

        public static int GetTotalWords(string s)
        {
            if (string.IsNullOrWhiteSpace(s))
            {
                return 0;
            }

            char[] delimiters = { ' ', '\r', '\n', '\t', '.', ',', ';', ':', '!', '?' };

            string[] words = s.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);

            return words.Length;
        }
    }
}
