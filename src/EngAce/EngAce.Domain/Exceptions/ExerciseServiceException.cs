namespace EngAce.Domain.Exceptions;

public class ExerciseServiceException : Exception
{
    public ExerciseServiceException()
    {
    }

    public ExerciseServiceException(string message) : base(message)
    {
    }

    public ExerciseServiceException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
