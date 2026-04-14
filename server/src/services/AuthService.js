const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const MailService = require('./MailService');
const { queueEmail } = require('../queues/emailQueue');
const logger = require('../utils/logger');

/**
 * Hash a raw token so we never store plaintext in DB
 */
const hashToken = (raw) => crypto.createHash('sha256').update(raw).digest('hex');

class AuthService {
  // ────────────────────────────────────────────────────────────────
  // REGISTER
  // ────────────────────────────────────────────────────────────────
  static async register(data) {
    const { email, password } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('EMAIL_TAKEN');

    const hashedPassword = await bcrypt.hash(password, 12); // cost 12 for production

    // Generate a unique username by checking existence
    let username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const userCount = await prisma.user.count({ where: { username: { startsWith: username } } });
    if (userCount > 0) {
      username = `${username}_${crypto.randomBytes(3).toString('hex')}`;
    }

    // Generate a secure raw token → store only the hash
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    let user;
    try {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: email.split('@')[0],
          username,
          verificationToken: tokenHash,
          verificationExpires: expires,
          lastVerificationSent: new Date(),
          isVerified: false,
        },
      });
    } catch (err) {
      // P2002 = Unique constraint violation (race condition on email/username)
      if (err.code === 'P2002') throw new Error('EMAIL_TAKEN');
      throw err;
    }

    // Enqueue background email job
    queueEmail('verification', email, rawToken).catch(err => {
      logger.error('Failed to enqueue registration email:', err);
    });

    return {
      message: 'REGISTER_SUCCESS_VERIFY_EMAIL',
      email: user.email,
    };
  }

  // ────────────────────────────────────────────────────────────────
  // VERIFY EMAIL
  // ────────────────────────────────────────────────────────────────
  static async verifyEmail(rawToken) {
    if (!rawToken) throw new Error('TOKEN_REQUIRED');

    const tokenHash = hashToken(rawToken);

    const user = await prisma.user.findUnique({
      where: { verificationToken: tokenHash },
    });

    if (!user) throw new Error('INVALID_OR_EXPIRED_TOKEN');

    // Guard: already verified?
    if (user.isVerified) throw new Error('ALREADY_VERIFIED');

    // Guard: token expired?
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      throw new Error('TOKEN_EXPIRED');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
    });

    return { message: 'EMAIL_VERIFIED_SUCCESS' };
  }

  // ────────────────────────────────────────────────────────────────
  // RESEND VERIFICATION (with 60-second rate limit)
  // ────────────────────────────────────────────────────────────────
  static async resendVerification(email) {
    if (!email) throw new Error('EMAIL_REQUIRED');

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('USER_NOT_FOUND');
    if (user.isVerified) throw new Error('ALREADY_VERIFIED');

    // Rate-limit: 60 seconds between resends
    if (user.lastVerificationSent) {
      const secondsSinceLast = (Date.now() - user.lastVerificationSent.getTime()) / 1000;
      if (secondsSinceLast < 60) {
        const waitSecs = Math.ceil(60 - secondsSinceLast);
        throw new Error(`RATE_LIMITED:${waitSecs}`);
      }
    }

    // Issue a fresh token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: tokenHash,
        verificationExpires: expires,
        lastVerificationSent: new Date(),
      },
    });

    await queueEmail('verification', email, rawToken);
    return { message: 'VERIFICATION_RESENT' };
  }

  // ────────────────────────────────────────────────────────────────
  // LOGIN
  // ────────────────────────────────────────────────────────────────
  static async login(data) {
    const { email, password, remember } = data;

    const user = await prisma.user.findUnique({ where: { email } });

    // Use constant-time compare to avoid timing attacks
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('INVALID_CREDENTIALS');
    }

    if (!user.isVerified) {
      throw new Error('EMAIL_NOT_VERIFIED');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.activeRole },
      process.env.JWT_SECRET,
      { expiresIn: remember ? '7d' : '24h' }
    );

    const { password: _, verificationToken: __, verificationExpires: ___, lastVerificationSent: ____, ...safeUser } = user;
    return { token, user: safeUser };
  }

  // ────────────────────────────────────────────────────────────────
  // GET ME
  // ────────────────────────────────────────────────────────────────
  static async getMe(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('NOT_FOUND');

    const { password, verificationToken, verificationExpires, lastVerificationSent, ...safeUser } = user;
    return safeUser;
  }

  // ────────────────────────────────────────────────────────────────
  // UPDATE PROFILE
  // ────────────────────────────────────────────────────────────────
  static async updateProfile(userId, updateData) {
    // Whitelist allowed fields to prevent mass-assignment attacks
    const allowed = ['name', 'username', 'avatar', 'bio', 'specialization', 'activeRole'];
    const safe = {};
    for (const key of allowed) {
      if (updateData[key] !== undefined) safe[key] = updateData[key];
    }

    const user = await prisma.user.update({ where: { id: userId }, data: safe });
    const { password, verificationToken, verificationExpires, lastVerificationSent, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = AuthService;
