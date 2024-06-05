using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace EngAce.Filters
{
    /// <summary>
    /// Customize the message of standard HTTP status codes.
    /// Appling this filter leads to the change for you API responses.
    /// </summary>
    public class AutoStatusCodes : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Result is ObjectResult objectResult)
            {
                (int statusCode, string desctiption) = GetStatusCode(context.HttpContext.Request.Method, objectResult.StatusCode);
                objectResult.StatusCode = statusCode;

                objectResult.Value = new
                {
                    StatusCode = statusCode,
                    Description = desctiption,
                    ResponseData = objectResult.Value
                };
            }

            base.OnActionExecuted(context);
        }

        private (int statusCode, string message) GetStatusCode(string method, int? currentStatusCode)
        {
            method = method.ToUpper();

            int defaultStatusCode = StatusCodes.Status200OK;
            string defaultMessage = "Success";
            switch (method)
            {
                case "POST":
                    defaultStatusCode = StatusCodes.Status201Created;
                    defaultMessage = "New item has been created";
                    break;
                case "DELETE":
                    defaultStatusCode = StatusCodes.Status204NoContent;
                    defaultMessage = "Success with no data response";
                    break;
            }

            if (!currentStatusCode.HasValue || !IsValid(currentStatusCode.Value))
            {
                return (defaultStatusCode, defaultMessage);
            }

            return (currentStatusCode.Value, GetDescriptionOf(currentStatusCode.Value));
        }

        private bool IsValid(int statusCode)
        {
            var standardStatusCodes = new int[]
            {
                StatusCodes.Status200OK,
                StatusCodes.Status201Created,
                StatusCodes.Status204NoContent,
                StatusCodes.Status400BadRequest,
                StatusCodes.Status401Unauthorized,
                StatusCodes.Status403Forbidden,
                StatusCodes.Status404NotFound,
                StatusCodes.Status405MethodNotAllowed,
                StatusCodes.Status406NotAcceptable,
                StatusCodes.Status409Conflict,
                StatusCodes.Status415UnsupportedMediaType,
                StatusCodes.Status500InternalServerError,
                StatusCodes.Status501NotImplemented,
                StatusCodes.Status503ServiceUnavailable
            };

            return standardStatusCodes.Contains(statusCode);
        }

        private string GetDescriptionOf(int statusCode)
        {
            switch (statusCode)
            {
                case StatusCodes.Status200OK:
                    return "Success";
                case StatusCodes.Status201Created:
                    return "New item has been created";
                case StatusCodes.Status204NoContent:
                    return "Success with no data response";
                case StatusCodes.Status400BadRequest:
                    return "Error while sending your request";
                case StatusCodes.Status401Unauthorized:
                    return "You are not authorized";
                case StatusCodes.Status403Forbidden:
                    return "You are forbiden to send this request";
                case StatusCodes.Status404NotFound:
                    return "Your requested data is not found";
                case StatusCodes.Status405MethodNotAllowed:
                    return "The method of your request is not correct";
                case StatusCodes.Status406NotAcceptable:
                    return "Your request is not accepted";
                case StatusCodes.Status409Conflict:
                    return "Conflict data";
                case StatusCodes.Status415UnsupportedMediaType:
                    return "The media type of the payload of your request is not supported";
                case StatusCodes.Status500InternalServerError:
                    return "Error while executing your request from the server";
                case StatusCodes.Status501NotImplemented:
                    return "Your API has not been implemented yet";
                case StatusCodes.Status503ServiceUnavailable:
                    return "The server is not available now";
                default:
                    return "Cannot found any suitable description";
            }
        }
    }
}
