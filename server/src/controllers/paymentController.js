const PaymentService = require('../services/PaymentService');

class PaymentController {
  /**
   * Инициировать оплату сделки
   */
  async createPayment(req, res) {
    try {
      const { dealId } = req.params;
      const checkoutUrl = await PaymentService.createPayment(dealId, req.user.id);
      res.json({ checkoutUrl });
    } catch (err) {
      console.error('Payment creation error:', err);
      res.status(400).json({ message: err.message });
    }
  }

  /**
   * Принять вебхук от ЮKassa
   */
  async handleWebhook(req, res) {
    try {
      // Get IP and signature for security
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const signature = req.headers['x-yookassa-signature'];

      await PaymentService.handleWebhook(req.body, clientIp, signature, req.rawBody);
      res.status(200).send('OK');
    } catch (err) {
      console.error('Webhook error:', err);
      res.status(500).send('Internal Error');
    }
  }
}

module.exports = new PaymentController();
