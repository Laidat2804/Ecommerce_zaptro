const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Route Đăng ký (POST /api/auth/register)
router.post('/register', authController.register);

// Route Đăng nhập (POST /api/auth/login)
router.post('/login', authController.login);

// Route verify session (GET /api/auth/me) — check token + account status
router.get('/me', verifyToken, authController.getMe);

module.exports = router;