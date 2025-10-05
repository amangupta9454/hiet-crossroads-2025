const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return res.status(400).json({ msg: 'Invalid Indian mobile number' });
  }

  try {
    const user = await User.findOne({ $or: [{ email }, { mobile }] });
    if (user) {
      return res.status(400).json({ msg: 'Email or mobile number already exists' });
    }

    const newUser = new User({ name, email, mobile, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ msg: 'User registered successfully', token, user: { id: newUser._id, name: newUser.name, email: newUser.email, mobile: newUser.mobile } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
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
    res.status(500).json({ msg: 'Server error', error: err.message });
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
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

module.exports = { register, login, getUserData };