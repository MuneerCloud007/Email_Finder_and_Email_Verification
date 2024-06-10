import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    }
},{timestamps:true});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
    const payload = { id: this._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' }); // Access token
    return token;
};

// Method to generate Refresh token
userSchema.methods.generateRefreshToken = function () {
    const payload = { id: this._id };
    const refreshToken = jwt.sign(payload, 'your_refresh_token_secret', { expiresIn: '7d' });
    this.refreshToken = refreshToken;
    return refreshToken;
};

// Method to verify Refresh token
userSchema.methods.verifyRefreshToken = function (token) {
    try {
        const decoded = jwt.verify(token, 'your_refresh_token_secret');
        return decoded.id === this._id.toString();
    } catch (error) {
        return false;
    }
};

const User = mongoose.model('User', userSchema);

export default  User;
