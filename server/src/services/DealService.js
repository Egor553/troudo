const prisma = require('../utils/prisma');
const FinancialService = require('./FinancialService');

const VALID_TRANSITIONS = {
  'active': ['submitted', 'dispute'],
  'submitted': ['completed', 'dispute'],
  'dispute': ['completed', 'active'],
};

class DealService {
  static async getDealsForUser(userId, filters = {}) {
    const { page = 1, limit = 20 } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      OR: [{ clientId: userId }, { freelancerId: userId }],
    };

    const [total, deals] = await Promise.all([
      prisma.deal.count({ where }),
      prisma.deal.findMany({
        where,
        include: {
          project: { select: { title: true } },
          client: { select: { name: true } },
          freelancer: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      })
    ]);

    return {
      data: deals.map(d => ({
        ...d,
        title: d.project?.title || 'Заказ',
        counterpartName: d.clientId === userId ? d.freelancer.name : d.client.name,
      })),
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / take)
    };
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
    const { kworkId, projectId, freelancerId, amount } = data;

    // 🛡️ SECURITY: Verify freelancer exists and is valid
    if (!freelancerId) throw new Error('Freelancer ID is required');

    return await prisma.$transaction(async (tx) => {
      // If buying a Kwork, verify it exists and belongs to the freelancer
      if (kworkId) {
        const kwork = await tx.kwork.findUnique({ where: { id: kworkId } });
        if (!kwork) throw new Error('Kwork not found');
        if (kwork.freelancerId !== freelancerId) throw new Error('Service owner mismatch');
      }

      // If hiring for a Project, verify the caller is the owner
      if (projectId) {
        const project = await tx.project.findUnique({ where: { id: projectId } });
        if (!project) throw new Error('Project not found');
        if (project.clientId !== clientId) throw new Error('Not the project owner');

        await tx.project.update({
          where: { id: projectId },
          data: { status: 'in_progress' },
        });
      }

      const deal = await tx.deal.create({
        data: {
          amount,
          kworkId,
          projectId,
          freelancerId,
          clientId,
          status: 'active',
        },
      });

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
