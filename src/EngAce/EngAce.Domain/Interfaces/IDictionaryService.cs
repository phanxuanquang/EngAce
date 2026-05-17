using EngAce.Domain.Exceptions;
using EngAce.Domain.Models;

namespace EngAce.Domain.Interfaces;

public interface IDictionaryService
{
    /// <summary>
    /// Retrieves the definitions for a given vocabulary word.
    /// </summary>
    /// <param name="vocabulary">The word for which to retrieve vocabulary information.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the vocabulary information.</returns>
    /// <exception cref="DictionaryServiceException">Thrown when the vocabulary retrieval process encounters an error.</exception>
    Task<IReadOnlyList<WordDefinition>> GetVocabularyAsync(string vocabulary);
}
