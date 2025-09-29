const bcrypt = require('bcryptjs');
const Joi = require('joi');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  addRefreshToken,
  removeRefreshToken,
  isRefreshTokenValid
} = require('../utils/jwt');
require('dotenv').config();


// TODO: Replace with real DB query
const findUserByEmail = async (email) => {
  // Example: Replace with DB lookup
  if (email === 'test@gmail.com') {
    return {
      email: 'test@gmail.com',
      password: bcrypt.hashSync('password123', 8)
    };
  }
  return null;
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Generate access and refresh tokens
    const accessToken = signAccessToken({ email: user.email });
    const refreshToken = signRefreshToken({ email: user.email });
    addRefreshToken(refreshToken);
    // Set tokens as HttpOnly cookies
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken || !isRefreshTokenValid(refreshToken)) {
    return res.status(401).json({ message: 'Refresh token not found or invalid' });
  }
  try {
    const userData = verifyRefreshToken(refreshToken);
    // Rotate refresh token
    removeRefreshToken(refreshToken);
    const newAccessToken = signAccessToken({ email: userData.email });
    const newRefreshToken = signRefreshToken({ email: userData.email });
    addRefreshToken(newRefreshToken);
    res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ message: 'Token refreshed' });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};
