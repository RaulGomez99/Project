const router = require('express').Router();
const LoginController = require('../controller/login.controller');
const auth = require('../models/auth.model');

router.post('/login', LoginController.verifyLogin);
router.get('/findUser', LoginController.findUser);

module.exports = router;