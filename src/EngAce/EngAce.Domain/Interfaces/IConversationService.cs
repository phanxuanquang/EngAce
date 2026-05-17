using EngAce.Domain.Exceptions;
using EngAce.Domain.Models;

namespace EngAce.Domain.Interfaces;

public interface IConversationService
{
    /// <summary>
    /// Generates responses based on the provided conversation history. The conversation history is a list of entries, where each entry contains the content of the message, the role of the sender (e.g., user or assistant), and a timestamp. The service processes this history to generate appropriate responses, which can be used in a conversational AI context.
    /// </summary>
    /// <param name="conversationHistory">The conversation history containing all previous messages.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a read-only list of generated conversation entries.</returns>
    /// <exception cref="ConversationServiceException">Thrown when the response generation process encounters an error.</exception>
    Task<IReadOnlyList<ConversationEntry>> GenerateResponsesAsync(IEnumerable<ConversationEntry> conversationHistory, CancellationToken cancellationToken = default);
}