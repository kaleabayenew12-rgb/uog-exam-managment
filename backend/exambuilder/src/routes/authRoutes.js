const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Dummy user for demonstration (replace with DB lookup in production)
const user = {
  email: 'test@gmail.com',
  // password: 'password123' (hashed)
  password: bcrypt.hashSync('password123', 8)
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email !== user.email || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  // Generate JWT token
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  res.json({ token });
});

const { login, refreshToken } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { loginSchema } = require('../utils/validator');


router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);

module.exports = router;
