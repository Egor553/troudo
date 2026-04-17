const projectService = require('../services/projectServiceV2');

const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.user.id, req.body);
    res.status(201).json(project);
  } catch (e) {
    next(e);
  }
};

const listProjects = async (req, res, next) => {
  try {
    const projects = await projectService.listProjects();
    res.json(projects);
  } catch (e) {
    next(e);
  }
};

module.exports = { createProject, listProjects };
