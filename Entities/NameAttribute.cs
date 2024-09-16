using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class NameAttribute : Attribute
    {
        public string Name { get; }

        public NameAttribute(string name)
        {
            Name = name;
        }

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
