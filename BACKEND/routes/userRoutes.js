const express = require('express');
const { signup, verifyEmail, login, getProfile } = require('../controllers/userController');
const protect = require('../authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/verify', verifyEmail);
router.post('/login', login);
router.get('/profile', protect, getProfile); // New profile route

module.exports = router;