const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route POST /api/payments/pay/:dealId
 * @desc Инициировать оплату заказа (Кворка или Проекта)
 * @access Private
 */
router.post('/pay/:dealId', protect, PaymentController.createPayment);

/**
 * @route POST /api/payments/webhook
 * @desc Принять уведомление от ЮKassa
 * @access Public (Защита должна проверяться внутри контроллера по IP или секрету)
 */
router.post('/webhook', PaymentController.handleWebhook);

module.exports = router;
