const router = require('express').Router();
const auth = require('../middleware/authJwt');
const controller = require('../controllers/userControllerV2');

router.get('/me', auth, controller.getProfile);
router.patch('/me', auth, controller.updateProfile);
router.patch('/switch-role', auth, controller.switchRole);

module.exports = router;
