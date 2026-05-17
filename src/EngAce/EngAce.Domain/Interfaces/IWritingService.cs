using EngAce.Domain.Exceptions;
using EngAce.Domain.Models;

namespace EngAce.Domain.Interfaces;

public interface IWritingService
{
    /// <summary>
    /// Generates a detailed review of the candidate's writing based on the provided requirement.
    /// </summary>
    /// <param name="requirement">The writing requirement or prompt that the candidate is responding to.</param>
    /// <param name="candidateWriting">The candidate's written response to the requirement.</param>
    /// <returns>A <see cref="WritingReview"/> object containing the detailed review of the candidate's writing.</returns>
    /// <exception cref="WritingServiceException">Thrown when the writing review process encounters an error.</exception>
    Task<WritingReview> GenerateWritingReviewAsync(string requirement, string candidateWriting, CancellationToken cancellationToken = default);

    /// <summary>
    /// Generate a revised version of the candidate's writing based on the provided requirement and the detailed review.
    /// </summary>
    /// <param name="requirement">The writing requirement or prompt that the candidate is responding to.</param>
    /// <param name="candidateWriting">The candidate's written response to the requirement.</param>
    /// <param name="review">The detailed review of the candidate's writing.</param>
    /// <returns>A string containing the revised version of the candidate's writing.</returns>
    /// <exception cref="WritingServiceException">Thrown when the writing improvement process encounters an error.</exception>
    Task<string> ImproveWritingAsync(string requirement, string candidateWriting, WritingReview review, CancellationToken cancellationToken = default);
}