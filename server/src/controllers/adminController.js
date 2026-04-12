const prisma = require('../utils/prisma');

const getStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const activeDeals = await prisma.deal.count({
      where: { status: { not: 'completed' } },
    });
    
    const completedDeals = await prisma.deal.findMany({
      where: { status: 'completed' },
      select: { amount: true },
    });
    
    const turnover = completedDeals.reduce((sum, d) => sum + Number(d.amount), 0);

    res.json({
      totalUsers,
      activeDeals,
      turnover,
      pendingKworks: 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении статистики: ' + err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(users.map(({ password, ...u }) => u));
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении пользователей: ' + err.message });
  }
};

module.exports = {
  getStats,
  getAllUsers,
};
