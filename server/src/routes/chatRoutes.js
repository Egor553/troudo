const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

router.get('/list', authenticateToken, chatController.getChatList);
router.get('/:dealId/messages', authenticateToken, chatController.getMessages);
router.post('/:dealId/messages', authenticateToken, chatController.sendMessage);
router.patch('/:dealId/read', authenticateToken, chatController.markAsRead);

module.exports = router;
