const prisma = require('../utils/prisma');

const getAllProjects = async (req, res) => {
  const { category, q } = req.query;

  try {
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

    // Map to include offerCount for compatibility
    res.json(projects.map(p => ({ ...p, offersCount: p._count.offers })));
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении проектов: ' + err.message });
  }
};

const createProject = async (req, res) => {
  try {
    const project = await prisma.project.create({
      data: {
        ...req.body,
        clientId: req.user.id,
      },
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при создании проекта: ' + err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        client: { select: { name: true, avatar: true } },
      },
    });
    if (!project) return res.status(404).json({ message: 'Проект не найден' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка: ' + err.message });
  }
};

const createOffer = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ message: 'Проект не найден' });

    const offer = await prisma.offer.create({
      data: {
        ...req.body,
        projectId,
        freelancerId: req.user.id,
      },
    });

    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при создании отклика: ' + err.message });
  }
};

const getProjectOffers = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    const offers = await prisma.offer.findMany({
      where: { projectId },
      include: {
        freelancer: { select: { id: true, name: true, avatar: true, specialization: true } },
      },
    });

    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении откликов: ' + err.message });
  }
};

module.exports = {
  getAllProjects,
  createProject,
  getProjectById,
  createOffer,
  getProjectOffers,
};
