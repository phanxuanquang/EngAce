namespace EngAce.Domain.Exceptions;

public class DictionaryServiceException : Exception
{
    public DictionaryServiceException()
    {
    }

    public DictionaryServiceException(string message) : base(message)
    {
    }

    public DictionaryServiceException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
