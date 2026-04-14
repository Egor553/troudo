const nodemailer = require('nodemailer');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mail.ru',
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: process.env.SMTP_SECURE !== 'false', // true by default (port 465)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Prevent SMTP connection hanging
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 15000,
    });

    // Verify connection configuration on startup (non-blocking)
    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('✅ MailService: SMTP connection verified successfully');
    } catch (error) {
      console.error('❌ MailService: SMTP configuration error —', error.message);
      console.error('   Check EMAIL_USER, EMAIL_PASS, SMTP_HOST, SMTP_PORT env vars');
    }
  }

  /**
   * Send email with automatic retry on transient errors
   */
  async sendWithRetry(mailOptions, retries = MAX_RETRIES) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        logger.info(`✅ Email sent to ${mailOptions.to} (attempt ${attempt}), messageId: ${info.messageId}`);
        return info;
      } catch (error) {
        const isLastAttempt = attempt === retries;
        console.error(`❌ Email attempt ${attempt}/${retries} failed for ${mailOptions.to}: ${error.message}`);

        if (error.code === 'EAUTH') {
          // Auth errors won't recover with retries — fail immediately
          throw new Error('SMTP_AUTH_FAILED: Check EMAIL_USER and EMAIL_PASS');
        }

        if (isLastAttempt) {
          throw new Error('FAILED_TO_SEND_EMAIL');
        }

        await sleep(RETRY_DELAY_MS * attempt); // exponential back-off: 2s, 4s, 6s
      }
    }
  }

  async sendVerificationEmail(to, rawToken) {
    const url = `${process.env.FRONTEND_URL}/verify?token=${rawToken}`;

    return this.sendWithRetry({
      from: `"Troudo Team" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Подтверждение регистрации на Troudo',
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #0f0f14; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Troudo</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Фриланс-маркетплейс</p>
          </div>
          <div style="padding: 40px 32px;">
            <h2 style="margin: 0 0 16px; font-size: 22px;">Подтвердите ваш Email</h2>
            <p style="color: #94a3b8; line-height: 1.6; margin: 0 0 32px;">
              Здравствуйте! Спасибо за регистрацию. Нажмите кнопку ниже, чтобы подтвердить ваш адрес и получить полный доступ к платформе.<br><br>
              <strong style="color: #f59e0b;">Ссылка действительна 24 часа.</strong>
            </p>
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 16px 36px; text-decoration: none; border-radius: 100px; font-weight: 700; font-size: 16px;">
                Подтвердить Email →
              </a>
            </div>
            <p style="color: #64748b; font-size: 13px; margin: 0 0 8px;">Если кнопка не работает, скопируйте ссылку:</p>
            <p style="word-break: break-all; color: #6366f1; font-size: 12px; background: rgba(99,102,241,0.08); padding: 12px; border-radius: 8px;">${url}</p>
          </div>
          <div style="padding: 24px 32px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
            <p style="color: #475569; font-size: 12px; margin: 0;">
              📁 Если письмо не найдено — проверьте папку <strong>Спам</strong><br>
              Если это были не вы — просто проигнорируйте это сообщение.
            </p>
          </div>
        </div>
      `,
    });
  }
}

module.exports = new MailService();
