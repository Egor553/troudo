const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', authenticateToken, dealController.getAllDeals);
router.get('/:id', authenticateToken, dealController.getDealById);
router.post('/', authenticateToken, requireRole('client'), dealController.createDeal);
router.patch('/:id/status', authenticateToken, dealController.updateDealStatus);

module.exports = router;
