const UserService = require('../services/UserService');

const getUserById = async (req, res) => {
  try {
    const user = await UserService.getPublicProfile(req.params.id);
    res.json(user);
  } catch (err) {
    const status = err.message === 'NOT_FOUND' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

module.exports = {
  getUserById,
};
