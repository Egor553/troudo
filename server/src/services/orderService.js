const prisma = require('../utils/prisma');
const { createNotification } = require('./notificationService');

const recalcSellerConnects = async (sellerId) => {
  const completed = await prisma.order.count({ where: { sellerId, status: 'completed' } });
  const cancelled = await prisma.order.count({ where: { sellerId, status: 'cancelled' } });
  const totalFinished = completed + cancelled;
  if (totalFinished > 0 && completed === 0) {
    await prisma.connects.upsert({
      where: { userId: sellerId },
      create: { userId: sellerId, available: 0, total: 30 },
      update: { available: 0 },
    });
  }
};

const createOrder = async (buyerId, payload) => {
  const service = await prisma.service.findUnique({ where: { id: payload.serviceId } });
  if (!service) throw new Error('Услуга не найдена');

  const price = Number(payload.price || service.priceBasic);
  const buyer = await prisma.user.findUnique({ where: { id: buyerId } });
  if (Number(buyer.balance) < price) throw new Error('Недостаточно средств');

  const deadline = payload.deadline ? new Date(payload.deadline) : new Date(Date.now() + 3 * 24 * 3600 * 1000);

  const order = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: buyerId },
      data: { balance: { decrement: price } },
    });

    return tx.order.create({
      data: {
        buyerId,
        sellerId: service.userId,
        serviceId: service.id,
        price,
        deadline,
      },
    });
  });

  await createNotification({
    userId: order.sellerId,
    type: 'order',
    text: `Новый заказ по услуге "${service.title}"`,
  });

  return order;
};

const updateOrderStatus = async (id, status, actorId) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new Error('Заказ не найден');
  if (![order.buyerId, order.sellerId].includes(actorId)) throw new Error('Нет доступа');

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  });

  if (status === 'cancelled') {
    await prisma.review.upsert({
      where: { orderId: id },
      create: {
        orderId: id,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        rating: 1,
        text: 'Автоматический негативный отзыв: заказ отменен.',
      },
      update: {
        rating: 1,
        text: 'Автоматический негативный отзыв: заказ отменен.',
      },
    });
    await recalcSellerConnects(order.sellerId);
  }

  return updated;
};

const completeOrder = async (id, actorId) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new Error('Заказ не найден');
  if (![order.buyerId, order.sellerId].includes(actorId)) throw new Error('Нет доступа');

  return prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id },
      data: { status: 'completed' },
    });
    await tx.user.update({
      where: { id: order.sellerId },
      data: { balance: { increment: order.price } },
    });
    await tx.service.update({
      where: { id: order.serviceId },
      data: { sales: { increment: 1 } },
    });
    return updated;
  });
};

module.exports = {
  createOrder,
  updateOrderStatus,
  completeOrder,
};
