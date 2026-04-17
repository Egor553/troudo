const router = require('express').Router();
const auth = require('../middleware/authJwt');
const controller = require('../controllers/notificationControllerV2');

router.get('/', auth, controller.listMine);
router.post('/', auth, controller.createOne);

module.exports = router;
