const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const authorizeOwnership = require('../middleware/ownership');

router.get('/', authenticateToken, dealController.getAllDeals);

// Use authorizeOwnership to ensure only Client or Freelancer see the deal
router.get('/:id', authenticateToken, authorizeOwnership('Deal', ['clientId', 'freelancerId']), dealController.getDealById);

router.post('/', authenticateToken, requireRole('client'), dealController.createDeal);

// Status updates also protected
router.patch('/:id/status', authenticateToken, authorizeOwnership('Deal', ['clientId', 'freelancerId']), dealController.updateDealStatus);

module.exports = router;
