const prisma = require('../utils/prisma');

const createReview = async (buyerId, payload) => {
  const order = await prisma.order.findUnique({ where: { id: payload.orderId } });
  if (!order) throw new Error('Заказ не найден');
  if (order.buyerId !== buyerId) throw new Error('Только покупатель может оставить отзыв');

  const review = await prisma.review.create({
    data: {
      orderId: payload.orderId,
      buyerId,
      sellerId: order.sellerId,
      rating: payload.rating,
      text: payload.text,
    },
  });

  const agg = await prisma.review.aggregate({
    where: { sellerId: order.sellerId },
    _avg: { rating: true },
  });

  await prisma.user.update({
    where: { id: order.sellerId },
    data: { rating: Number(agg._avg.rating || 0) },
  });

  return review;
};

const getReviews = async ({ sellerId }) => {
  return prisma.review.findMany({
    where: { sellerId: sellerId || undefined },
    orderBy: { createdAt: 'desc' },
  });
};

module.exports = {
  createReview,
  getReviews,
};
