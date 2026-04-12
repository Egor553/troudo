const prisma = require('../utils/prisma');

const getAllDeals = async (req, res) => {
  try {
    const deals = await prisma.deal.findMany({
      where: {
        OR: [
          { clientId: req.user.id },
          { freelancerId: req.user.id },
        ],
      },
      include: {
        project: { select: { title: true } },
        client: { select: { name: true } },
        freelancer: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(deals.map(d => ({
      ...d,
      title: d.project?.title || 'Заказ',
      counterpartName: d.clientId === req.user.id ? d.freelancer.name : d.client.name,
    })));
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении сделок: ' + err.message });
  }
};

const getDealById = async (req, res) => {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: req.params.id },
      include: {
        project: { select: { title: true, description: true } },
        client: { select: { name: true, avatar: true } },
        freelancer: { select: { name: true, avatar: true } },
      },
    });

    if (!deal) return res.status(404).json({ message: 'Сделка не найдена' });
    if (deal.clientId !== req.user.id && deal.freelancerId !== req.user.id) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка: ' + err.message });
  }
};

const createDeal = async (req, res) => {
  const { projectId, freelancerId, amount } = req.body;

  try {
    const deal = await prisma.$transaction(async (tx) => {
      // Create the deal
      const newDeal = await tx.deal.create({
        data: {
          amount,
          projectId,
          freelancerId,
          clientId: req.user.id,
          status: 'active',
        },
      });

      // Update project status if it exists
      if (projectId) {
        await tx.project.update({
          where: { id: projectId },
          data: { status: 'in_progress' },
        });
      }

      return newDeal;
    });

    res.status(201).json(deal);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при создании сделки: ' + err.message });
  }
};

const updateDealStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) return res.status(404).json({ message: 'Сделка не найдена' });

    // Strict lifecycle transitions
    if (status === 'submitted') {
      if (deal.freelancerId !== req.user.id) return res.status(403).json({ message: 'Только исполнитель может сдать работу' });
      if (deal.status !== 'active') return res.status(400).json({ message: 'Некорректный переход статуса' });
    }

    if (status === 'completed') {
      if (deal.clientId !== req.user.id) return res.status(403).json({ message: 'Только заказчик может подтвердить работу' });
      if (deal.status !== 'submitted') return res.status(400).json({ message: 'Работа еще не сдана' });
      
      // Perform balance update in transaction
      return await prisma.$transaction(async (tx) => {
        const updatedDeal = await tx.deal.update({
          where: { id },
          data: { status: 'completed' },
        });

        await tx.user.update({
          where: { id: deal.freelancerId },
          data: { balance: { increment: deal.amount } },
        });

        // Log transaction
        await tx.transaction.create({
          data: {
            userId: deal.freelancerId,
            amount: deal.amount,
            type: 'payment',
          }
        });

        return res.json(updatedDeal);
      });
    }

    // Generic status update (e.g. dispute)
    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: { status },
    });

    res.json(updatedDeal);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка обновления статуса: ' + err.message });
  }
};

module.exports = {
  getAllDeals,
  getDealById,
  createDeal,
  updateDealStatus,
};
