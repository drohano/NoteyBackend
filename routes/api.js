var express = require('express');
var router = express.Router();
var controller = require('../controllers/api');

router.post('/user/register', controller.register);
router.post('/user/login', controller.login);

router.post('/notes/create', controller.create);

module.exports = router;