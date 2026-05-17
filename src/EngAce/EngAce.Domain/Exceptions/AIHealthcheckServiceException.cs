namespace EngAce.Domain.Exceptions;

public class AIHealthcheckServiceException : Exception
{
    public AIHealthcheckServiceException()
    {
    }

    public AIHealthcheckServiceException(string message) : base(message)
    {
    }

    public AIHealthcheckServiceException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
