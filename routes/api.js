var express = require('express');
var router = express.Router();
var controller = require('../controllers/api');

router.post('/user/register', controller.register);

module.exports = router;