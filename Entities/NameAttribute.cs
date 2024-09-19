namespace Entities
{
    public class NameAttribute(string name) : Attribute
    {
        public string Name { get; } = name;

        public static string GetEnumName(Enum value)
        {
            var type = value.GetType();
            var memberInfo = type.GetMember(value.ToString());
            var attributes = memberInfo[0].GetCustomAttributes(typeof(NameAttribute), false);

            if (attributes.Length > 0)
            {
                return ((NameAttribute)attributes[0]).Name;
            }

            return value.ToString();
        }
    }
}
