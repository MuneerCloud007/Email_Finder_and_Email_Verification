import ApiError from './ApiError.js';

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        console.log(err.message); 
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            errors: err.errors,
        });
    }

    // Default to 500 server error if the error is not an instance of ApiError
    console.log(err);
    const message=err.message || "Internal Server Error"
    return res.status(500).json({
        status: 'error',
        message: message,
    });
};

const use = fn => (req, res, next) =>Promise.resolve(fn(req, res, next)).catch(next);
    

export { errorHandler, use };
