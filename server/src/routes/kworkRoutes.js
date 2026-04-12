const express = require('express');
const router = express.Router();
const kworkController = require('../controllers/kworkController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createKworkSchema } = require('../utils/validationSchemas');

router.get('/', kworkController.getAllKworks);
router.post('/', authenticateToken, requireRole('freelancer'), validate(createKworkSchema), kworkController.createKwork);
router.get('/:id', kworkController.getKworkById);

module.exports = router;
