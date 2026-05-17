using EngAce.Domain.Models.Enums;

namespace EngAce.Api.DTOs;

public sealed record ExerciseGenerationRequest(string Topic, IEnumerable<ExerciseType>? Types, int NumberOfExercises);