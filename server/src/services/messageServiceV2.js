const prisma = require('../utils/prisma');
const { emitToUser } = require('../utils/socket');
const { createNotification } = require('./notificationService');

const normalizePair = (a, b) => (a < b ? [a, b] : [b, a]);

const sendMessage = async (senderId, payload) => {
  const [user1Id, user2Id] = normalizePair(senderId, payload.receiverId);

  await prisma.conversation.upsert({
    where: { user1Id_user2Id: { user1Id, user2Id } },
    create: { user1Id, user2Id },
    update: { updatedAt: new Date() },
  });

  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId: payload.receiverId,
      text: payload.text,
    },
  });

  emitToUser(payload.receiverId, 'message:new', message);
  await createNotification({
    userId: payload.receiverId,
    type: 'message',
    text: 'Новое сообщение',
  });

  return message;
};

const getDialog = async (userId, peerId) => {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: peerId },
        { senderId: peerId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: 'asc' },
  });
};

module.exports = {
  sendMessage,
  getDialog,
};
