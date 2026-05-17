using EngAce.Domain.Exceptions;
using System.Net;

namespace EngAce.Domain.Models;

public sealed class AiServiceHealthcheckResult
{
    public HttpStatusCode StatusCode { get; init; }
    public string Message { get; init; } = string.Empty;
    public AIHealthcheckServiceException? Error { get; init; }
}