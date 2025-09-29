const jwt = require('jsonwebtoken');
require('dotenv').config();


// Access token
exports.signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
};
exports.verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret');
};

// Refresh token
exports.signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refreshsecret', { expiresIn: '7d' });
};
exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refreshsecret');
};

// In-memory store for refresh tokens (replace with DB in production)
let refreshTokens = [];
exports.addRefreshToken = (token) => refreshTokens.push(token);
exports.removeRefreshToken = (token) => {
  refreshTokens = refreshTokens.filter(t => t !== token);
};
exports.isRefreshTokenValid = (token) => refreshTokens.includes(token);
