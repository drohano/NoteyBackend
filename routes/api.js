var express = require('express');
var router = express.Router();
var controller = require('../controllers/api');

router.post('/user/register', controller.register);
router.post('/user/login', controller.login);
router.post('/user/decode', controller.decode);
router.post('/notes/create', controller.create);
router.get('/notes/', controller.read);
router.get('/notes/:id', controller.note);
router.put('/notes/update/:id', controller.update);
router.delete('/notes/delete/:id', controller.delete);

module.exports = router;