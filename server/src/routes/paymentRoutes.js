const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route POST /api/payments/pay/:dealId
 * @desc Инициировать оплату заказа (Кворка или Проекта)
 * @access Private
 */
router.post('/pay/:dealId', authenticateToken, PaymentController.createPayment);

/**
 * @route POST /api/payments/webhook
 * @desc Принять уведомление от ЮKassa
 * @access Public (Защита должна проверяться внутри контроллера по IP или секрету)
 */
router.post('/webhook', PaymentController.handleWebhook);

module.exports = router;
