const prisma = require('../utils/prisma');
const { createNotification } = require('./notificationService');

const createProposal = async (sellerId, payload) => {
  const connects = await prisma.connects.findUnique({ where: { userId: sellerId } });
  if (!connects || connects.available <= 0) {
    throw new Error('Недостаточно connects для отклика');
  }

  const project = await prisma.project.findUnique({ where: { id: payload.projectId } });
  if (!project) throw new Error('Проект не найден');

  const proposal = await prisma.$transaction(async (tx) => {
    const created = await tx.proposal.create({
      data: {
        projectId: payload.projectId,
        sellerId,
        text: payload.text,
        price: payload.price,
      },
    });

    await tx.connects.update({
      where: { userId: sellerId },
      data: { available: { decrement: 1 } },
    });

    return created;
  });

  await createNotification({
    userId: project.buyerId,
    type: 'proposal',
    text: 'Получен новый отклик по вашему проекту',
  });

  return proposal;
};

module.exports = {
  createProposal,
};
