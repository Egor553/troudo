const AdminService = require('../services/AdminService');

const getStats = async (req, res) => {
  try {
    const stats = await AdminService.getPlatformStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении статистики: ' + err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await AdminService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении пользователей: ' + err.message });
  }
};

module.exports = {
  getStats,
  getAllUsers,
};
