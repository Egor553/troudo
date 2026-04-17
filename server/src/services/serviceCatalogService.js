const prisma = require('../utils/prisma');

const createService = async (sellerId, payload) => {
  return prisma.service.create({
    data: {
      ...payload,
      userId: sellerId,
    },
  });
};

const updateService = async (id, sellerId, payload) => {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) throw new Error('Услуга не найдена');
  if (service.userId !== sellerId) throw new Error('Нет доступа');

  return prisma.service.update({
    where: { id },
    data: payload,
  });
};

const deleteService = async (id, sellerId) => {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) throw new Error('Услуга не найдена');
  if (service.userId !== sellerId) throw new Error('Нет доступа');
  await prisma.service.delete({ where: { id } });
};

const listServices = async (query) => {
  const {
    categoryId,
    sellerId,
    isActive,
    minPrice,
    maxPrice,
    search,
  } = query;

  return prisma.service.findMany({
    where: {
      categoryId: categoryId || undefined,
      userId: sellerId || undefined,
      isActive: isActive === undefined ? undefined : isActive === 'true',
      title: search ? { contains: search, mode: 'insensitive' } : undefined,
      priceBasic:
        minPrice || maxPrice
          ? {
              gte: minPrice ? Number(minPrice) : undefined,
              lte: maxPrice ? Number(maxPrice) : undefined,
            }
          : undefined,
    },
    orderBy: { createdAt: 'desc' },
  });
};

module.exports = {
  createService,
  updateService,
  deleteService,
  listServices,
};
