const express = require('express');
const { register, login, getUserData } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', auth, getUserData);

module.exports = router;