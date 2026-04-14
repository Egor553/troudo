const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, updateProfileSchema } = require('../utils/validationSchemas');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticateToken, authController.getMe);
router.post('/logout', authenticateToken, authController.logout);
router.patch('/profile', authenticateToken, validate(updateProfileSchema), authController.updateProfile);

// ── Email Verification Routes ──
router.post('/verify', authController.verify);
router.post('/resend-verify', authController.resendVerification);

module.exports = router;
