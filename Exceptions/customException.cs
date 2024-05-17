
class CustomException : Exception
{
    public int StatusCode { get; set; } = 500;
    public CustomException(string message, int StatusCode) : base(message)
    {
        this.StatusCode = StatusCode;
    }
}
class CustomBadRequest : CustomException
{
    public CustomBadRequest(string message = "Bad request") : base(message, 400)
    {
    }
}
class CustomUnauthorized : CustomException
{
    public CustomUnauthorized(string message = "Unauthorized") : base(message, 401)
    {
    }
}

class CustomForbidden : CustomException
{
    public CustomForbidden(string message = "Forbidden") : base(message, 403)
    {
    }
}

class CustomNotFound : CustomException
{
    public CustomNotFound(string message = "Not found") : base(message, 404)
    {
    }
}

class CustomMethodNotAllowed : CustomException
{
    public CustomMethodNotAllowed(string message = "Method not allowed") : base(message, 405)
    {
    }
}

class CustomNotAcceptable : CustomException
{
    public CustomNotAcceptable(string message = "Not acceptable") : base(message, 406)
    {
    }
}

class CustomRequestTimeout : CustomException
{
    public CustomRequestTimeout(string message = "Request timeout") : base(message, 408)
    {
    }
}

class CustomInternalServerError : CustomException
{
    public CustomInternalServerError(string message = "Internal server error") : base(message, 500)
    {
    }
}