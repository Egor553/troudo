const prisma = require('../utils/prisma');

class AdminService {
  static async getPlatformStats() {
    const totalUsers = await prisma.user.count();
    const activeDeals = await prisma.deal.count({
      where: { status: { not: 'completed' } },
    });
    
    const completedDeals = await prisma.deal.findMany({
      where: { status: 'completed' },
      select: { amount: true },
    });
    
    const turnover = completedDeals.reduce((sum, d) => sum + Number(d.amount), 0);

    return {
      totalUsers,
      activeDeals,
      turnover,
      pendingKworks: 0,
    };
  }

  static async getAllUsers() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map(({ password, ...u }) => u);
  }
}

module.exports = AdminService;
