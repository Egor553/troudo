const prisma = require('../utils/prisma');

const createProject = async (buyerId, payload) => {
  return prisma.project.create({
    data: {
      buyerId,
      title: payload.title,
      description: payload.description,
      budgetMin: payload.budgetMin,
      budgetMax: payload.budgetMax,
    },
  });
};

const listProjects = async () => {
  return prisma.project.findMany({
    include: { buyer: { select: { id: true, username: true, rating: true } }, proposals: true },
    orderBy: { createdAt: 'desc' },
  });
};

module.exports = {
  createProject,
  listProjects,
};
