const prisma = require('../utils/prisma');
const FinancialService = require('./FinancialService');

const VALID_TRANSITIONS = {
  'active': ['submitted', 'dispute'],
  'submitted': ['completed', 'dispute'],
  'dispute': ['completed', 'active'], 
};

class DealService {
  static async getDealsForUser(userId) {
    const deals = await prisma.deal.findMany({
      where: {
        OR: [{ clientId: userId }, { freelancerId: userId }],
      },
      include: {
        project: { select: { title: true } },
        client: { select: { name: true } },
        freelancer: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return deals.map(d => ({
      ...d,
      title: d.project?.title || 'Заказ',
      counterpartName: d.clientId === userId ? d.freelancer.name : d.client.name,
    }));
  }

  static async getDealById(id, userId) {
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        project: { select: { title: true, description: true } },
        client: { select: { name: true, avatar: true } },
        freelancer: { select: { name: true, avatar: true } },
      },
    });

    if (!deal) throw new Error('NOT_FOUND');
    if (deal.clientId !== userId && deal.freelancerId !== userId) throw new Error('FORBIDDEN');
    
    return deal;
  }

  static async createDeal(data, clientId) {
    return await prisma.$transaction(async (tx) => {
      const deal = await tx.deal.create({
        data: {
          ...data,
          clientId,
          status: 'active',
        },
      });

      if (data.projectId) {
        await tx.project.update({
          where: { id: data.projectId },
          data: { status: 'in_progress' },
        });
      }

      return deal;
    });
  }

  static async updateStatus(id, newStatus, userId) {
    // 🛡️ RE-FETCH WITH ATOMICITY IN MIND
    return await prisma.$transaction(async (tx) => {
      const deal = await tx.deal.findUnique({ where: { id } });
      if (!deal) throw new Error('NOT_FOUND');

      // Security & Role checks
      if (newStatus === 'submitted' && deal.freelancerId !== userId) throw new Error('ONLY_FREELANCER_CAN_SUBMIT');
      if (newStatus === 'completed' && deal.clientId !== userId) throw new Error('ONLY_CLIENT_CAN_COMPLETE');

      // State machine logic
      const allowed = VALID_TRANSITIONS[deal.status];
      if (!allowed || !allowed.includes(newStatus)) {
        throw new Error(`INVALID_TRANSITION: Cannot move from ${deal.status} to ${newStatus}`);
      }

      // 💳 FINANCIAL LOGIC (with double-pay protection)
      if (newStatus === 'completed') {
        const result = await tx.deal.updateMany({
           where: { id, status: deal.status }, // Ensure status hasn't changed since read
           data: { status: 'completed' }
        });
        
        if (result.count === 0) throw new Error('STATE_CONFLICT');

        await FinancialService.updateBalance(tx, deal.freelancerId, deal.amount, 'payment', `Оплата по сделке #${id}`);
        return await tx.deal.findUnique({ where: { id } });
      }

      // Generic update logic
      const result = await tx.deal.updateMany({
        where: { id, status: deal.status },
        data: { status: newStatus }
      });

      if (result.count === 0) throw new Error('STATE_CONFLICT');
      return await tx.deal.findUnique({ where: { id } });
    });
  }
}

module.exports = DealService;
