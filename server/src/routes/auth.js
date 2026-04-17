const router = require('express').Router();
const controller = require('../controllers/authControllerV2');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/verify', controller.verify);
router.post('/resend-verify', controller.resendVerify);
router.get('/me', controller.authMiddleware, controller.me);

module.exports = router;
