const router = require('express').Router();
const auth = require('../middleware/authJwt');
const controller = require('../controllers/orderControllerV2');

router.post('/', auth, controller.createOrder);
router.patch('/:id/status', auth, controller.updateStatus);
router.post('/:id/complete', auth, controller.completeOrder);

module.exports = router;
