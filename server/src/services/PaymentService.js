const { YooCheckout } = require('@a2seven/yoo-checkout');
const prisma = require('../utils/prisma');
const ChatService = require('./ChatService');
const { v4: uuidv4 } = require('uuid');

// Рекомендуется передавать ShopID и SecretKey из .env
const checkout = new YooCheckout({
  shopId: process.env.YOOKASSA_SHOP_ID,
  secretKey: process.env.YOOKASSA_SECRET_KEY
});

class PaymentService {
  /**
   * Создать платеж для конкретной сделки
   */
  async createPayment(dealId, userId) {
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { client: true }
    });

    if (!deal) throw new Error('Сделка не найдена');
    if (deal.clientId !== userId) throw new Error('Вы не являетесь заказчиком этой сделки');

    const idempotenceKey = uuidv4();

    // Формируем запрос к ЮKassa
    const createPayload = {
      amount: {
        value: deal.amount.toString(),
        currency: 'RUB'
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.YOOKASSA_RETURN_URL || 'http://localhost:5173/dashboard'}`
      },
      capture: true, // Сразу подтверждаем платеж (без escrow на данном этапе)
      description: `Оплата заказа #${deal.id} на Troudo`,
      metadata: {
        dealId: deal.id
      }
    };

    const payment = await checkout.createPayment(createPayload, idempotenceKey);

    // Сохраняем payment_id в сделку
    await prisma.deal.update({
      where: { id: dealId },
      data: {
        paymentId: payment.id,
        paymentStatus: payment.status
      }
    });

    return payment.confirmation.confirmation_url;
  }

  /**
   * Обработать уведомление от ЮKassa (Webhook)
   */
  async handleWebhook(notification, clientIp, signature, rawBody) {
    const logger = require('../utils/logger');
    const crypto = require('crypto');

    // 🛡️ SECURITY: Verify Signature (HMAC-SHA256 as requested)
    if (process.env.NODE_ENV === 'production') {
      if (!signature || !rawBody) {
        logger.error(`🛑 Rejected unsigned webhook from IP: ${clientIp}`);
        throw new Error('MISSING_SIGNATURE');
      }

      const hmac = crypto.createHmac('sha256', process.env.YOOKASSA_WEBHOOK_SECRET);
      hmac.update(rawBody);
      const expectedSignature = hmac.digest('hex');

      if (signature !== expectedSignature) {
        logger.error(`🛑 Webhook signature mismatch from IP: ${clientIp}`);
        throw new Error('INVALID_SIGNATURE');
      }
    }

    // 🛡️ SECURITY: Verify sender IP (standard for YooKassa)
    const allowedIps = [
      '185.71.76.', '185.71.77.', '77.75.153.', '77.75.156.'
    ];

    const isMatch = allowedIps.some(range => clientIp.startsWith(range));
    if (!isMatch && process.env.NODE_ENV === 'production') {
      logger.warn(`🛑 Webhook source IP warning: ${clientIp} (continuing due to valid signature)`);
    }

    const { event, object } = notification;
    logger.info(`🔔 YooKassa Webhook: ${event} for ID ${object.id}`);

    if (event === 'payment.succeeded') {
      const paymentId = object.id;
      const dealId = object.metadata.dealId;

      const deal = await prisma.deal.findUnique({ where: { id: dealId } });
      if (!deal) {
        logger.error(`❌ Webhook error: Deal ${dealId} not found`);
        return true; // Return true to ack YooKassa even if internal error
      }

      // 🛡️ IDEMPOTENCY: Check if already processed
      if (deal.paymentStatus === 'succeeded' || deal.status === 'active') {
        logger.info(`⏭️ Skipping already processed webhook for deal ${dealId}`);
        return true;
      }

      // Обновляем статус сделки в БД
      const updatedDeal = await prisma.deal.update({
        where: { id: dealId },
        data: {
          paymentStatus: 'succeeded',
          status: 'active'
        }
      });

      // 💬 Отправляем системное сообщение в чат
      try {
        await ChatService.sendMessage(dealId, updatedDeal.clientId, '✅ Оплата получена! Сделка активирована. Вы можете начать обсуждение деталей заказа.');
      } catch (err) {
        logger.error('Ошибка при отправке системного сообщения:', err);
      }

      logger.info(`✅ Платеж ${paymentId} для сделки ${dealId} успешно подтвержден.`);
    }

    if (event === 'payment.canceled') {
      const dealId = object.metadata.dealId;
      await prisma.deal.update({
        where: { id: dealId },
        data: { paymentStatus: 'canceled' }
      }).catch(e => logger.error('Error updating canceled payment:', e));
    }

    return true;
  }
}

module.exports = new PaymentService();
