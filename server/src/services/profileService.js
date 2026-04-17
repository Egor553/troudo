const prisma = require('../utils/prisma');

const sanitizeUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profileSettings: true, connects: true },
  });
  if (!user) throw new Error('Пользователь не найден');
  return sanitizeUser(user);
};

const updateProfile = async (userId, data) => {
  if (data.bio && (data.bio.length < 200 || data.bio.length > 1200)) {
    throw new Error('bio должен быть от 200 до 1200 символов');
  }
  if (data.skills && data.skills.length > 12) {
    throw new Error('skills может содержать максимум 12 элементов');
  }

  const {
    country,
    city,
    timezone,
    workStart,
    workEnd,
    phoneVerified,
    ...userData
  } = data;

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...userData,
      profileSettings:
        country || city || timezone || workStart || workEnd || phoneVerified !== undefined
          ? {
              upsert: {
                create: { country, city, timezone, workStart, workEnd, phoneVerified: !!phoneVerified },
                update: { country, city, timezone, workStart, workEnd, phoneVerified: !!phoneVerified },
              },
            }
          : undefined,
    },
    include: { profileSettings: true, connects: true },
  });

  return sanitizeUser(updated);
};

const switchRole = async (userId, role) => {
  if (!['buyer', 'seller'].includes(role)) throw new Error('Некорректная роль');
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      role,
      connects: role === 'seller' ? { upsert: { create: { available: 30, total: 30 }, update: {} } } : undefined,
    },
  });
  return sanitizeUser(user);
};

module.exports = {
  getProfile,
  updateProfile,
  switchRole,
};
