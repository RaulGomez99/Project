const express = require('express');
const LoginController = require('../controller/login.controller');
const router = express.Router();

router.get('/', LoginController.getAll);

module.exports = router;