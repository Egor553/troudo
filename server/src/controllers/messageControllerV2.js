const messageService = require('../services/messageServiceV2');

const sendMessage = async (req, res, next) => {
  try {
    const message = await messageService.sendMessage(req.user.id, req.body);
    res.status(201).json(message);
  } catch (e) {
    next(e);
  }
};

const getDialog = async (req, res, next) => {
  try {
    const messages = await messageService.getDialog(req.user.id, req.query.peerId);
    res.json(messages);
  } catch (e) {
    next(e);
  }
};

module.exports = { sendMessage, getDialog };
