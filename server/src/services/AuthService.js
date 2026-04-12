const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

class AuthService {
  static async register(data) {
    const { email, password } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('EMAIL_TAKEN');

    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split('@')[0],
        username: email.split('@')[0],
      },
    });
  }

  static async login(data) {
    const { email, password, remember } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: remember ? '30d' : '24h' }
    );

    const { password: _, ...safeUser } = user;
    return { token, user: safeUser };
  }

  static async getMe(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('NOT_FOUND');

    const { password, ...safeUser } = user;
    return safeUser;
  }

  static async updateProfile(userId, updateData) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    const { password, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = AuthService;
