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
    let status = 500;
    if (err.message === 'INVALID_CREDENTIALS') status = 401;
    if (err.message === 'EMAIL_NOT_VERIFIED') status = 403;

    res.status(status).json({ message: err.message });
  }
};

const verify = async (req, res) => {
  try {
    const result = await AuthService.verifyEmail(req.body.token);
    res.json(result);
  } catch (err) {
    const status = err.message.includes('TOKEN') ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};

const resendVerification = async (req, res) => {
  try {
    const result = await AuthService.resendVerification(req.body.email);
    res.json(result);
  } catch (err) {
    const status = (err.message === 'USER_NOT_FOUND' || err.message === 'ALREADY_VERIFIED') ? 400 : 500;
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

const logout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const { blacklistToken } = require('../utils/blacklist');
      // Blacklist for 7 days (matching our max JWT session)
      await blacklistToken(token, 7 * 24 * 60 * 60);
    }

    res.json({ message: 'LOGOUT_SUCCESS' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  logout,
  verify,
  resendVerification,
};
