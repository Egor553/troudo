const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/stats', authenticateToken, requireRole('admin'), adminController.getStats);
router.get('/users', authenticateToken, requireRole('admin'), adminController.getAllUsers);

module.exports = router;
