const prisma = require('../utils/prisma');

class FinancialService {
  /**
   * Updates user balance and logs the transaction.
   * MUST be called within a transaction if part of a deal completion.
   */
  static async updateBalance(tx, userId, amount, type, description = '') {
    const user = await tx.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } },
    });

    await tx.transaction.create({
      data: {
        userId,
        amount,
        type, // e.g., 'payment', 'withdrawal', 'deposit'
        description,
      },
    });

    return user;
  }

  static async getUserTransactions(userId) {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = FinancialService;
