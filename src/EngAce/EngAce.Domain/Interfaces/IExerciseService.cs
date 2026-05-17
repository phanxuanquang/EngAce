using EngAce.Domain.Exceptions;
using EngAce.Domain.Models;
using EngAce.Domain.Models.Enums;

namespace EngAce.Domain.Interfaces;

public interface IExerciseService
{
    /// <summary>
    /// Generates a list of exercise entries that are relevant to the specified topic, contain a specified total number of entries, and cover exercises of the specified types.
    /// </summary>
    /// <param name="topic">The topic for which to generate exercises.</param>
    /// <param name="totalEntries">The total number of exercise entries to generate.</param>
    /// <param name="types">The types of exercises to include in the generated list.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a read-only list of ExerciseEntry objects.</returns>
    /// <exception cref="ExerciseServiceException">Thrown when the exercise generation process encounters an error.</exception>
    Task<IReadOnlyList<ExerciseEntry>> GenerateExercisesAsync(string topic, int totalEntries, IEnumerable<ExerciseType> types, CancellationToken cancellationToken = default);
}