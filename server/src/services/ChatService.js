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

    // 🚀 Emit real-time message to room
    const io = getIO();
    io.to(dealId).emit('new_message', message);
    
    // Also notify about unread count update for the counterpart if not in room? 
    // Socket.io standard rooms handles this well if they are in the 'dealId' room.

    return message;
  }

  /**
   * Получить историю сообщений
   */
  async getMessages(dealId, userId) {
    const deal = await prisma.deal.findUnique({ where: { id: dealId } });
    if (!deal) throw new Error('NOT_FOUND');
    if (deal.clientId !== userId && deal.freelancerId !== userId) throw new Error('FORBIDDEN');

    return await prisma.chatMessage.findMany({
      where: { dealId },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, name: true, avatar: true } } }
    });
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
    
    // Notify about read status
    const io = getIO();
    io.to(dealId).emit('messages_read', { dealId, userId });
    
    return true;
  }
}

module.exports = new ChatService();
