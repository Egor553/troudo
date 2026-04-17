const router = require('express').Router();
const auth = require('../middleware/authJwt');
const controller = require('../controllers/proposalControllerV2');

router.post('/', auth, controller.createProposal);

module.exports = router;
