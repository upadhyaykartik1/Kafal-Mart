const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, phone, email, password, address } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone and password are required' });
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(409).json({ message: 'An account with this phone number already exists' });
    }

    const user = await User.create({ name, phone, email, password, address });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    const user = await User.findOne({ phone });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function getMe(req, res) {
  res.json(req.user);
}

module.exports = { register, login, getMe };
