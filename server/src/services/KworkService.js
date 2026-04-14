const prisma = require('../utils/prisma');

class KworkService {
  static async getAll(filters) {
    const { category, freelancerId, page = 1, limit = 20 } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      AND: [
        category ? { category } : {},
        freelancerId ? { freelancerId } : {},
      ],
    };

    const [total, kworks] = await Promise.all([
      prisma.kwork.count({ where }),
      prisma.kwork.findMany({
        where,
        include: {
          freelancer: { select: { name: true, avatar: true, username: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      })
    ]);

    return {
      data: kworks,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / take)
    };
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
    const { title, description, price, category } = data;
    return await prisma.kwork.create({
      data: {
        title,
        description,
        price,
        category,
        freelancerId
      },
    });
  }
}

module.exports = KworkService;
