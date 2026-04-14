const prisma = require('../utils/prisma');

class ProjectService {
  static async getAll(filters) {
    const { category, q, page = 1, limit = 20 } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      AND: [
        category && category !== 'Все категории' ? { category } : {},
        q ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        } : {},
      ],
    };

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        include: {
          _count: { select: { offers: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      })
    ]);

    return {
      data: projects.map(p => ({ ...p, offersCount: p._count.offers })),
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / take)
    };
  }

  static async getById(id) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { client: { select: { name: true, avatar: true } } },
    });
    if (!project) throw new Error('NOT_FOUND');
    return project;
  }

  static async create(data, clientId) {
    const { title, description, budget, category } = data;
    return await prisma.project.create({
      data: {
        title,
        description,
        budget,
        category,
        clientId
      },
    });
  }

  static async getOffers(projectId, userId) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error('NOT_FOUND');
    if (project.clientId !== userId) throw new Error('FORBIDDEN');

    return await prisma.offer.findMany({
      where: { projectId },
      include: {
        freelancer: { select: { id: true, name: true, avatar: true, specialization: true } },
      },
    });
  }

  static async createOffer(projectId, data, freelancerId) {
    const { price, message } = data;
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error('NOT_FOUND');

    return await prisma.offer.create({
      data: {
        price,
        message,
        projectId,
        freelancerId
      },
    });
  }
}

module.exports = ProjectService;
