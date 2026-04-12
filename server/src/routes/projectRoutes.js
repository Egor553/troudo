const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createProjectSchema, createOfferSchema } = require('../utils/validationSchemas');

router.get('/', projectController.getAllProjects);
router.post('/', authenticateToken, requireRole('client'), validate(createProjectSchema), projectController.createProject);
router.get('/:id', projectController.getProjectById);

router.get('/:projectId/offers', authenticateToken, projectController.getProjectOffers);
router.post('/:projectId/offers', authenticateToken, requireRole('freelancer'), validate(createOfferSchema), projectController.createOffer);

module.exports = router;
