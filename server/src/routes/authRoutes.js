const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, updateProfileSchema } = require('../utils/validationSchemas');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticateToken, authController.getMe);
router.patch('/profile', authenticateToken, validate(updateProfileSchema), authController.updateProfile);

module.exports = router;
