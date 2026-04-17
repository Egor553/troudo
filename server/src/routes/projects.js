const router = require('express').Router();
const auth = require('../middleware/authJwt');
const controller = require('../controllers/projectControllerV2');

router.get('/', controller.listProjects);
router.post('/', auth, controller.createProject);

module.exports = router;
