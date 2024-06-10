import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import ApiError from './ApiError.js';

const checkAuthorization = async (req, res, next) => {
    const token = req.header('x-auth-token') || req.cookies.token;

    if (!token) {
        return next(ApiError.unauthorized('No token, authorization denied'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return next(ApiError.unauthorized('User not found'));
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return next(ApiError.unauthorized('Token expired'));
                }
                return next(ApiError.unauthorized('Token is not valid'));
            }
        });

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return next(ApiError.unauthorized('Token expired'));
        }
        next(ApiError.unauthorized('Token is not valid'));
    }
};

export default checkAuthorization;
