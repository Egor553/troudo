const prisma = require('../utils/prisma');

class ProjectService {
  static async getAll(filters) {
    const { category, q } = filters;
    const projects = await prisma.project.findMany({
      where: {
        AND: [
          category && category !== 'Все категории' ? { category } : {},
          q ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          } : {},
        ],
      },
      include: {
        _count: { select: { offers: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map(p => ({ ...p, offersCount: p._count.offers }));
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
    return await prisma.project.create({
      data: { ...data, clientId },
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
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error('NOT_FOUND');

    return await prisma.offer.create({
      data: { ...data, projectId, freelancerId },
    });
  }
}

module.exports = ProjectService;
