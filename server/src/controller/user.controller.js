import  User from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';


const register = async (req, res, next) => {
    console.log(req.body);
    const { name:username, email, password } = req.body;
    try {
        console.log(username)
        let user = await User.findOne({ username });
        if (user) {
            throw ApiError.badRequest('User already exists');
        }

        user = new User({ username, email, password });
        await user.save();
        res.status(200).json({ msg: 'User registered successfully' });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        console.log(username+"=+="+password);
        const user = await User.findOne({ username });
        if (!user) {
            throw ApiError.unauthorized('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw ApiError.unauthorized('Invalid credentials');
        }

        const token = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();
        await user.save();

        res.cookie('token', token, { httpOnly: true, secure: false }); // Set 'secure: true' if using HTTPS
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false });
        console.log(user);
        res.json({ message:"user login successfully",token, refreshToken,userId:user["_id"] });
    } catch (err) {
        next(err);
    }
};

const refresh = async (req, res, next) => {
    const { refresh_Token } = req.body;
    let refreshToken=refresh_Token || req.cookies["refreshToken"]
    try {
        if (!refreshToken) {
            throw ApiError.unauthorized('No refresh token provided');
        }

        const user = await User.findOne({ refreshToken });
        if (!user) {
            throw ApiError.unauthorized('Invalid refresh token');
        }

        const isValid = user.verifyRefreshToken(refreshToken);
        if (!isValid) {
            throw ApiError.unauthorized('Invalid refresh token');
        }

        const token = user.generateAuthToken();
        const newRefreshToken = user.generateRefreshToken();
        await user.save();

        res.cookie('token', token, { httpOnly: true, secure: false }); // Set 'secure: true' if using HTTPS
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: false });


        res.json({ 'message':"new access refresh token",token, refreshToken: newRefreshToken });
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        next(err);
    }
};

export { register, refresh, logout, login };
