using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace EngAce.Domain.Extensions;

public static class EnumExtensions
{
    private static DisplayAttribute? GetDisplayAttribute(this Enum value)
    {
        var type = value.GetType();
        var memberInfo = type.GetMember(value.ToString());
        if (memberInfo.Length > 0)
        {
            var attributes = memberInfo[0].GetCustomAttributes(typeof(DisplayAttribute), false);
            if (attributes.Length > 0)
            {
                return (DisplayAttribute)attributes[0];
            }
        }
        return null;
    }

    public static string? GetDisplayName(this Enum value)
    {
        return value.GetDisplayAttribute()?.Name;
    }

    public static string? GetDisplayDescription(this Enum value)
    {
        return value.GetDisplayAttribute()?.Description;
    }
}