using EngAce.Domain.Models;
using System.ComponentModel.DataAnnotations;

namespace EngAce.Api.DTOs;

/// <param name="Requirement">The writing prompt or task requirement.</param>
/// <param name="CandidateWriting">The candidate's written response.</param>
/// <param name="Review">The detailed review previously generated.</param>
public sealed record WritingImprovementRequest(
    [Required][MinLength(1, ErrorMessage = "Requirement must not be empty.")]
    string Requirement,

    [Required][MinLength(1, ErrorMessage = "CandidateWriting must not be empty.")]
    string CandidateWriting,

    [Required(ErrorMessage = "Review must not be null.")]
    WritingReview Review);