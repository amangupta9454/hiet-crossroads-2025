const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  // Input validation
  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({ msg: 'Name must be at least 2 characters' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ msg: 'Invalid email format' });
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return res.status(400).json({ msg: 'Invalid Indian mobile number (10 digits starting with 6-9)' });
  }

  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters' });
  }

  try {
    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { mobile }] });
    if (existingUser) {
      return res.status(409).json({ msg: 'Email or mobile number already registered' });
    }

    // Create and save user
    const newUser = new User({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      mobile: mobile.trim(), 
      password 
    });
    await newUser.save();

    // Generate token
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ 
      msg: 'User registered successfully', 
      token, 
      user: { id: newUser._id, name: newUser.name, email: newUser.email, mobile: newUser.mobile } 
    });
  } catch (err) {
    console.error('Registration error details:', err); // Log for Render debugging
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Validation failed: ' + Object.values(err.errors)[0].message });
    }
    if (err.code === 11000) {
      return res.status(409).json({ msg: 'Email or mobile number already exists' });
    }
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('getUserData error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { register, login, getUserData };