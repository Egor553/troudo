const router = require('express').Router();
const auth = require('../middleware/authJwt');
const controller = require('../controllers/serviceControllerV2');

router.get('/', controller.listServices);
router.post('/', auth, controller.createService);
router.patch('/:id', auth, controller.updateService);
router.delete('/:id', auth, controller.deleteService);

module.exports = router;
