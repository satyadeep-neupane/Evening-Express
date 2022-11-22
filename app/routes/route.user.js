const router = require('express').Router();
const userController = require('../controller/userController');

router.route('/')
    .get(userController.list)
    .post(userController.store);

router.delete('/:id', userController.destroy);

module.exports = router;