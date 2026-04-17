const orderService = require('../services/orderService');

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status, req.user.id);
    res.json(order);
  } catch (e) {
    next(e);
  }
};

const completeOrder = async (req, res, next) => {
  try {
    const order = await orderService.completeOrder(req.params.id, req.user.id);
    res.json(order);
  } catch (e) {
    next(e);
  }
};

module.exports = { createOrder, updateStatus, completeOrder };
