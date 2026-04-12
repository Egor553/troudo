const prisma = require('../utils/prisma');

class KworkService {
  static async getAll(filters) {
    const { category, freelancerId } = filters;
    return await prisma.kwork.findMany({
      where: {
        AND: [
          category ? { category } : {},
          freelancerId ? { freelancerId } : {},
        ],
      },
      include: {
        freelancer: { select: { name: true, avatar: true, username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(id) {
    const kwork = await prisma.kwork.findUnique({
      where: { id },
      include: { freelancer: { select: { name: true, avatar: true, username: true } } },
    });
    if (!kwork) throw new Error('NOT_FOUND');
    return kwork;
  }

  static async create(data, freelancerId) {
    return await prisma.kwork.create({
      data: { ...data, freelancerId },
    });
  }
}

module.exports = KworkService;
