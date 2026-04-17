const authService = require('../services/authService');
const authMiddleware = require('../middleware/authJwt');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

const verify = async (req, res, next) => {
  try {
    const result = await authService.verifyEmail(req.body.token);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

const resendVerify = async (req, res, next) => {
  try {
    const result = await authService.resendVerification(req.body.email);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

const me = async (req, res, next) => {
  try {
    const result = await authService.getMe(req.user.id);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

module.exports = { register, login, verify, resendVerify, me, authMiddleware };
