using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class ChatResponse
    {
        public required string MessageInMarkdown { get; set; }
        public List<string> Suggestions { get; set; } = [];
    }
}
