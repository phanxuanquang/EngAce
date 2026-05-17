namespace EngAce.Domain.Exceptions;

public class ConversationServiceException : Exception
{
    public ConversationServiceException()
    {
    }

    public ConversationServiceException(string message) : base(message)
    {
    }

    public ConversationServiceException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
