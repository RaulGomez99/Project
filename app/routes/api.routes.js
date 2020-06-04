const router = require('express').Router();

const LoginController = require('../controller/login.controller');
const PaypalController = require('../controller/paypal.controller');

const auth = require('../models/auth.model');

router.post('/users/login' , LoginController.logIn);
router.get( '/users/logout', LoginController.logOut);

router.get('/users/findUser', LoginController.findUser);

router.get('/paypal/payment', PaypalController.payment);
router.get('/paypal/success', PaypalController.success);
router.get('/paypal/cancel' , PaypalController.cancel);

module.exports = router;