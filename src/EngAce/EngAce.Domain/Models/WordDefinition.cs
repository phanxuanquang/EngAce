using EngAce.Domain.Models.Enums;

namespace EngAce.Domain.Models;

public sealed record WordDefinition
{
    public string Pronunciation { get; init; } = string.Empty;
    public string Definition { get; init; } = string.Empty;
    public PartOfSpeech PartOfSpeech { get; init; }
    public string Etymology { get; init; } = string.Empty;
    public List<string> UseCases { get; init; } = [];
    public List<string> UsageNotes { get; init; } = [];
    public List<string> Examples { get; init; } = [];
    public List<string>? Synonyms { get; init; } = [];
    public List<string>? Antonyms { get; init; } = [];
    public List<string> QuickRememberTips { get; init; } = [];
    public List<string> RelatedWords { get; init; } = [];
}