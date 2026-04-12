const prisma = require('../utils/prisma');

const getAllKworks = async (req, res) => {
  const { category, freelancerId } = req.query;

  try {
    const kworks = await prisma.kwork.findMany({
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

    res.json(kworks);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении кворков: ' + err.message });
  }
};

const getKworkById = async (req, res) => {
  try {
    const kwork = await prisma.kwork.findUnique({
      where: { id: req.params.id },
      include: {
        freelancer: { select: { name: true, avatar: true, username: true } },
      },
    });
    if (!kwork) return res.status(404).json({ message: 'Кворк не найден' });
    res.json(kwork);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка: ' + err.message });
  }
};

const createKwork = async (req, res) => {
  try {
    const kwork = await prisma.kwork.create({
      data: {
        ...req.body,
        freelancerId: req.user.id,
      },
    });
    res.status(201).json(kwork);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при создании кворка: ' + err.message });
  }
};

module.exports = {
  getAllKworks,
  getKworkById,
  createKwork,
};
