var express = require('express');
var router = express.Router();
var controller = require('../controllers/api');

router.post('/user/register', controller.register);
router.post('/notes/create', controller.create);
router.get('/notes/', controller.read);

module.exports = router;