const AuthService = require('../services/AuthService');

const register = async (req, res) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    const status = err.message === 'EMAIL_TAKEN' ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await AuthService.login(req.body);
    res.json(result);
  } catch (err) {
    const status = err.message === 'INVALID_CREDENTIALS' ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await AuthService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    const status = err.message === 'NOT_FOUND' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await AuthService.updateProfile(req.user.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка обновления: ' + err.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
