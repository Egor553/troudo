const DealService = require('../services/DealService');

const getAllDeals = async (req, res) => {
  try {
    const deals = await DealService.getDealsForUser(req.user.id, req.query);
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении сделок: ' + err.message });
  }
};

const getDealById = async (req, res) => {
  try {
    const deal = await DealService.getDealById(req.params.id, req.user.id);
    res.json(deal);
  } catch (err) {
    const status = err.message === 'FORBIDDEN' ? 403 : err.message === 'NOT_FOUND' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

const createDeal = async (req, res) => {
  try {
    const deal = await DealService.createDeal(req.body, req.user.id);
    res.status(201).json(deal);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при создании сделки: ' + err.message });
  }
};

const updateDealStatus = async (req, res) => {
  try {
    const updatedDeal = await DealService.updateStatus(req.params.id, req.body.status, req.user.id);
    res.json(updatedDeal);
  } catch (err) {
    const status = err.message.includes('INVALID_TRANSITION') ? 400 :
      err.message.includes('ONLY_') ? 403 :
        err.message === 'NOT_FOUND' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

module.exports = {
  getAllDeals,
  getDealById,
  createDeal,
  updateDealStatus,
};
