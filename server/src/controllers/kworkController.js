const KworkService = require('../services/KworkService');

const getAllKworks = async (req, res) => {
  try {
    const kworks = await KworkService.getAll(req.query);
    res.json(kworks);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении кворков: ' + err.message });
  }
};

const getKworkById = async (req, res) => {
  try {
    const kwork = await KworkService.getById(req.params.id);
    res.json(kwork);
  } catch (err) {
    const status = err.message === 'NOT_FOUND' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

const createKwork = async (req, res) => {
  try {
    const kwork = await KworkService.create(req.body, req.user.id);
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
