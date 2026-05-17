namespace EngAce.Api.DTOs;

/// <param name="Requirement">The writing prompt or task requirement.</param>
/// <param name="CandidateWriting">The candidate's written response.</param>
public sealed record WritingReviewRequest(string Requirement, string CandidateWriting);