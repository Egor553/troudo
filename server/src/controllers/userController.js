const prisma = require('../utils/prisma');

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id },
          { username: id },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        specialization: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка: ' + err.message });
  }
};

module.exports = {
  getUserById,
};
