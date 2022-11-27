const router = require('express').Router();

const authController = require('../controller/authController');

router.post('/login', authController.attemptLogin);
router.post('refresh', authController.getNewAccessToken);

module.exports = router;