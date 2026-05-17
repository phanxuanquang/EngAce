namespace EngAce.Domain.Exceptions;

public class WritingServiceException : Exception
{
    public WritingServiceException()
    {
    }

    public WritingServiceException(string message) : base(message)
    {
    }

    public WritingServiceException(string message, Exception innerException) : base(message, innerException)
    {
    }
}