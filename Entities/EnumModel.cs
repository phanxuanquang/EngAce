using System.ComponentModel;

namespace Entities
{
    public enum EnumModel
    {
        [Description("gemini-1.0-pro")]
        Gemini_10_Pro = 1,

        [Description("gemini-1.5-pro")]
        Gemini_15_Pro = 2,

        [Description("gemini-1.5-flash")]
        Gemini_15_Flash = 3,
    }
}
