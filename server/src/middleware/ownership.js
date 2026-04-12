const prisma = require('../utils/prisma');

/**
 * Higher-order middleware to verify resource ownership.
 * @param {string} model - Prisma model name (e.g., 'Project', 'Deal')
 * @param {string|string[]} ownerFields - Field name(s) that store the owner ID
 */
const authorizeOwnership = (model, ownerFields) => async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const fields = Array.isArray(ownerFields) ? ownerFields : [ownerFields];

  try {
    const resource = await prisma[model.toLowerCase()].findUnique({
      where: { id },
    });

    if (!resource) {
      return res.status(404).json({ message: 'Ресурс не найден' });
    }

    const isOwner = fields.some(field => resource[field] === userId);

    if (!isOwner) {
      return res.status(403).json({ message: 'Доступ запрещен: вы не являетесь владельцем этого ресурса' });
    }

    req.resource = resource;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Ошибка проверки прав доступа: ' + err.message });
  }
};

module.exports = authorizeOwnership;
