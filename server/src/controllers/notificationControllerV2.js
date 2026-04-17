const { createNotification, listNotifications } = require('../services/notificationService');

const createOne = async (req, res, next) => {
  try {
    const item = await createNotification({
      userId: req.user.id,
      type: req.body.type,
      text: req.body.text,
    });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
};

const listMine = async (req, res, next) => {
  try {
    const list = await listNotifications(req.user.id);
    res.json(list);
  } catch (e) {
    next(e);
  }
};

module.exports = { createOne, listMine };
