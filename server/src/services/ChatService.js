const prisma = require('../utils/prisma');
const { getIO } = require('../utils/socket');

class ChatService {
  /**
   * Получить список всех диалогов пользователя (сделок)
   */
  async getChatList(userId) {
    const deals = await prisma.deal.findMany({
      where: {
        OR: [{ clientId: userId }, { freelancerId: userId }]
      },
      include: {
        client: { select: { id: true, name: true, avatar: true, username: true, lastSeen: true } },
        freelancer: { select: { id: true, name: true, avatar: true, username: true, lastSeen: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { sender: { select: { name: true } } }
        },
        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                NOT: { senderId: userId }
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return deals.map(d => {
      const counterpart = d.clientId === userId ? d.freelancer : d.client;
      return {
        dealId: d.id,
        title: d.project?.title || d.kwork?.title || 'Сделка',
        counterpart,
        lastMessage: d.messages[0],
        unreadCount: d._count.messages,
        updatedAt: d.updatedAt
      };
    });
  }

  /**
   * Отправить сообщение
   */
  async sendMessage(dealId, senderId, text) {
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { client: true, freelancer: true }
    });

    if (!deal) throw new Error('NOT_FOUND');
    if (deal.clientId !== senderId && deal.freelancerId !== senderId) {
      throw new Error('FORBIDDEN');
    }

    const message = await prisma.chatMessage.create({
      data: { text, dealId, senderId },
      include: { sender: { select: { name: true, avatar: true, username: true } } }
    });

    // 🚀 Emit real-time message — non-fatal if socket is down
    try {
      const io = getIO();
      io.to(dealId).emit('new_message', message);
    } catch (_socketErr) {
      // Socket may be down — message is still persisted, client will get it on refresh
    }

    return message;
  }

  /**
   * Получить историю сообщений
   */
  async getMessages(dealId, userId, filters = {}) {
    const { page = 1, limit = 50 } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const deal = await prisma.deal.findUnique({ where: { id: dealId } });
    if (!deal) throw new Error('NOT_FOUND');
    if (deal.clientId !== userId && deal.freelancerId !== userId) throw new Error('FORBIDDEN');

    const [total, messages] = await Promise.all([
      prisma.chatMessage.count({ where: { dealId } }),
      prisma.chatMessage.findMany({
        where: { dealId },
        orderBy: { createdAt: 'desc' }, // Order by desc for easier "load more" logic
        skip,
        take,
        include: { sender: { select: { id: true, name: true, avatar: true } } }
      })
    ]);

    return {
      data: messages.reverse(), // Reverse back to chronological for UI
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / take)
    };
  }

  /**
   * Пометить все сообщения чата как прочитанные
   */
  async markAsRead(dealId, userId) {
    await prisma.chatMessage.updateMany({
      where: {
        dealId,
        NOT: { senderId: userId },
        isRead: false
      },
      data: { isRead: true }
    });

    // Notify about read status — non-fatal if socket is temporarily down
    try {
      const io = getIO();
      io.to(dealId).emit('messages_read', { dealId, userId });
    } catch (_socketErr) { /* non-fatal */ }

    return true;
  }
}

module.exports = new ChatService();
