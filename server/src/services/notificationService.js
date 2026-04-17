const prisma = require('../utils/prisma');

const createNotification = async ({ userId, type = 'system', text }) => {
  return prisma.notification.create({
    data: { userId, type, text },
  });
};

const listNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

module.exports = {
  createNotification,
  listNotifications,
};
