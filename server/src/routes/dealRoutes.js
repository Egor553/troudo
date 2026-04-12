const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const authorizeOwnership = require('../middleware/ownership');
const validate = require('../middleware/validate');
const { createDealSchema, updateDealStatusSchema } = require('../schemas/dealSchemas');

router.get('/', authenticateToken, dealController.getAllDeals);

// Use authorizeOwnership to ensure only Client or Freelancer see the deal
router.get('/:id', authenticateToken, authorizeOwnership('Deal', ['clientId', 'freelancerId']), dealController.getDealById);

router.post('/', authenticateToken, requireRole('client'), validate(createDealSchema), dealController.createDeal);

// Status updates also protected
router.patch('/:id/status', authenticateToken, authorizeOwnership('Deal', ['clientId', 'freelancerId']), validate(updateDealStatusSchema), dealController.updateDealStatus);

module.exports = router;
