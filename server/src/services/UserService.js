const prisma = require('../utils/prisma');

class UserService {
  static async getPublicProfile(id) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id },
          { username: id },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        specialization: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) throw new Error('NOT_FOUND');
    return user;
  }
}

module.exports = UserService;
