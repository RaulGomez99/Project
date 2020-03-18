const express = require('express');
const LoginController = require('../controller/login.controller');
const router = express.Router();

router.post('/', LoginController.getAll);

module.exports = router;