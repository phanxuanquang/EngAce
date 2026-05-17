using EngAce.Domain.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace EngAce.Api.DTOs;

public sealed record ExerciseGenerationRequest(
    [Required][MinLength(1, ErrorMessage = "Topic must not be empty.")]
    string Topic,

    IEnumerable<ExerciseType>? Types,

    [Range(1, 50, ErrorMessage = "NumberOfExercises must be between 1 and 50.")]
    int NumberOfExercises);