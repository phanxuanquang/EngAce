using EngAce.Domain.Models;

namespace EngAce.Api.DTOs;

/// <param name="Requirement">The writing prompt or task requirement.</param>
/// <param name="CandidateWriting">The candidate's written response.</param>
/// <param name="Review">The detailed review previously generated.</param>
public sealed record WritingImprovementRequest(string Requirement, string CandidateWriting, WritingReview Review);