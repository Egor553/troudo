const serviceCatalogService = require('../services/serviceCatalogService');

const createService = async (req, res, next) => {
  try {
    const data = await serviceCatalogService.createService(req.user.id, req.body);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
};

const updateService = async (req, res, next) => {
  try {
    const data = await serviceCatalogService.updateService(req.params.id, req.user.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const deleteService = async (req, res, next) => {
  try {
    await serviceCatalogService.deleteService(req.params.id, req.user.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};

const listServices = async (req, res, next) => {
  try {
    const data = await serviceCatalogService.listServices(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

module.exports = { createService, updateService, deleteService, listServices };
