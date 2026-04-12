const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createProjectSchema, createOfferSchema } = require('../utils/validationSchemas');

const authorizeOwnership = require('../middleware/ownership');

router.get('/', projectController.getAllProjects);
router.post('/', authenticateToken, requireRole('client'), validate(createProjectSchema), projectController.createProject);
router.get('/:id', projectController.getProjectById);

// Only the project owner can view the offers (requires renaming projectId to id for the middleware)
router.get('/:id/offers', authenticateToken, authorizeOwnership('Project', 'clientId'), projectController.getProjectOffers);
router.post('/:projectId/offers', authenticateToken, requireRole('freelancer'), validate(createOfferSchema), projectController.createOffer);

module.exports = router;
