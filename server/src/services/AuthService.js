const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const MailService = require('./MailService');

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const publicUser = (user) => {
  const { password, verificationToken, verificationExpires, ...safe } = user;
  return safe;
};

const register = async ({ email, password, username, role = 'buyer' }) => {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error('На эту почту уже зарегистрирован аккаунт');

  const hashed = await bcrypt.hash(password, 10);
  const safeUsername = username || email.split('@')[0];
  const rawToken = crypto.randomBytes(24).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      username: `${safeUsername}_${Math.floor(Math.random() * 10000)}`,
      role,
      isVerified: false,
      verificationToken: tokenHash,
      verificationExpires,
      lastVerificationSent: new Date(),
      connects: role === 'seller' ? { create: { available: 30, total: 30 } } : undefined,
    },
  });

  try {
    await MailService.sendVerificationEmail(email, rawToken);
  } catch (e) {
    // Не падаем регистрацией, но сохраняем сообщение
  }

  return { email: user.email, message: 'Письмо подтверждения отправлено на почту' };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('INVALID_CREDENTIALS');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('INVALID_CREDENTIALS');
  if (!user.isVerified) throw new Error('EMAIL_NOT_VERIFIED');

  return { user: publicUser(user), token: signToken(user) };
};

const verifyEmail = async (token) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await prisma.user.findUnique({ where: { verificationToken: tokenHash } });
  if (!user) throw new Error('Недействительный или устаревший токен');
  if (user.verificationExpires && user.verificationExpires < new Date()) {
    throw new Error('Срок действия ссылки истек');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationExpires: null,
    },
  });

  return { message: 'Email успешно подтвержден' };
};

const resendVerification = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Пользователь не найден');
  if (user.isVerified) return { message: 'Email уже подтвержден' };

  const rawToken = crypto.randomBytes(24).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken: tokenHash,
      verificationExpires,
      lastVerificationSent: new Date(),
    },
  });
  await MailService.sendVerificationEmail(email, rawToken);
  return { message: 'Письмо отправлено повторно' };
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Пользователь не найден');
  return publicUser(user);
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  getMe,
};
