import User from "../models/user.model.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";
import jwt from 'jsonwebtoken';

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV == 'production') {
        cookieOptions.secure = true;
    }

    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({
        status: "success",
        data: [
            user
        ]
    });
};


export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError("Incorrect email or password", 401));
    };

    user.password = undefined;

    createAndSendToken(user, 200, res);
});

export const signup = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    
    user.password = undefined;
    createAndSendToken(user, 201, res);
})

export const protect = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError("You are not logged in", 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id).populate('roles');
    if(!currentUser){
        return new AppError("User no longer exist", 404);
    }

    if(currentUser.passwordChangedAfter(decoded.iat)){
        return new AppError("User changed his password", 401);
    }

    req.user = currentUser;
    next();
})