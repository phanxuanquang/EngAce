using EngAce.Domain.Models.Enums;

namespace EngAce.Domain.Models;

public sealed class WordDefinition
{
    public string Pronunciation { get; init; } = string.Empty;
    public string Definition { get; init; } = string.Empty;
    public PartOfSpeech PartOfSpeech { get; init; }
    public string Etymology { get; init; } = string.Empty;
    public IReadOnlyList<string> UseCases { get; init; } = [];
    public IReadOnlyList<string> UsageNotes { get; init; } = [];
    public IReadOnlyList<string> Examples { get; init; } = [];
    public IReadOnlyList<string>? Synonyms { get; init; } = [];
    public IReadOnlyList<string>? Antonyms { get; init; } = [];
    public IReadOnlyList<string> QuickRememberTips { get; init; } = [];
    public IReadOnlyList<string> RelatedWords { get; init; } = [];
}