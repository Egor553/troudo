const ProjectService = require('../services/ProjectService');

const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectService.getAll(req.query);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении проектов: ' + err.message });
  }
};

const createProject = async (req, res) => {
  try {
    const project = await ProjectService.create(req.body, req.user.id);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при создании проекта: ' + err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await ProjectService.getById(req.params.id);
    res.json(project);
  } catch (err) {
    const status = err.message === 'NOT_FOUND' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

const createOffer = async (req, res) => {
  try {
    const offer = await ProjectService.createOffer(req.params.projectId, req.body, req.user.id);
    res.status(201).json(offer);
  } catch (err) {
    const status = err.message === 'NOT_FOUND' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

const getProjectOffers = async (req, res) => {
  try {
    const offers = await ProjectService.getOffers(req.params.projectId, req.user.id);
    res.json(offers);
  } catch (err) {
    const status = err.message === 'FORBIDDEN' ? 403 : err.message === 'NOT_FOUND' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

module.exports = {
  getAllProjects,
  createProject,
  getProjectById,
  createOffer,
  getProjectOffers,
};
