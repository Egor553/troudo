const { YooCheckout } = require('yookassa-sdk');
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
  async handleWebhook(notification, clientIp) {
    // 🛡️ SECURITY: Verify sender IP (standard for YooKassa)
    const allowedIps = [
        '185.71.76.', '185.71.77.', '77.75.153.', '77.75.156.'
    ];

    const isMatch = allowedIps.some(range => clientIp.startsWith(range));
    if (!isMatch && process.env.NODE_ENV === 'production') {
        console.warn(`🛑 Blocked suspicious webhook attempt from IP: ${clientIp}`);
        throw new Error('UNAUTHORIZED_SOURCE');
    }

    const { event, object } = notification;

    if (event === 'payment.succeeded') {
      const paymentId = object.id;
      const dealId = object.metadata.dealId;

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
          console.error('Ошибка при отправке системного сообщения:', err.message);
      }

      console.log(`✅ Платеж ${paymentId} для сделки ${dealId} успешно подтвержден.`);
    }

    if (event === 'payment.canceled') {
        const dealId = object.metadata.dealId;
        await prisma.deal.update({
            where: { id: dealId },
            data: { paymentStatus: 'canceled' }
        });
    }

    return true;
  }
}

module.exports = new PaymentService();
