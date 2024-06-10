class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;

        // Maintaining proper stack trace (only available on V8 engines, e.g. Node.js)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    static badRequest(msg, errors = []) {
        return new ApiError(400, msg, errors);
    }

    static unauthorized(msg) {
        return new ApiError(401, msg);
    }

    static forbidden(msg) {
        return new ApiError(403, msg);
    }

    static notFound(msg) {
        return new ApiError(404, msg);
    }

    static internal(msg) {
        return new ApiError(500, msg);
    }
}
export default ApiError;
