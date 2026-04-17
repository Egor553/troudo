const router = require('express').Router();
const auth = require('../middleware/authJwt');
const controller = require('../controllers/messageControllerV2');

router.get('/', auth, controller.getDialog);
router.post('/', auth, controller.sendMessage);

module.exports = router;
