const jwt = require('jsonwebtoken');
require('dotenv').config();


const signAccessToken = (user) =>
    jwt.sign({ sub: String(user._id), role: user.role }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' });

const signRefreshToken = (user) =>
    jwt.sign({ sub: String(user._id), role: user.role }, process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' });

const verifyAccessToken = (token) => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

const verifyRefreshToken = (token) => jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);


 const accessCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path:'/api/v1',
    maxAge: 15* 60 * 60 * 1000,
});


 const refreshCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path:'/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
});


module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    refreshCookieOptions,
    accessCookieOptions
}