const router = require('express').Router();
const auth = require('../middleware/authJwt');
const controller = require('../controllers/reviewControllerV2');

router.get('/', controller.getReviews);
router.post('/', auth, controller.createReview);

module.exports = router;
