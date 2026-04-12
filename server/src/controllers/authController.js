const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email уже занят' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split('@')[0],
        username: email.split('@')[0],
      },
    });

    res.status(201).json({ message: 'Пользователь успешно создан' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при регистрации: ' + err.message });
  }
};

const login = async (req, res) => {
  const { email, password, remember } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: remember ? '30d' : '24h' }
    );

    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при входе: ' + err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка: ' + err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: req.body,
    });

    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка обновления: ' + err.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
