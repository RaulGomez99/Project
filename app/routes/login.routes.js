const router = require('express').Router();
const LoginController = require('../controller/login.controller');
const auth = require('../models/auth.model');

router.post('/login', LoginController.verifyLogin);
router.get('/', (req,res) => {
    res.send(auth.createToken({a:"a"}));
});
router.get('/verifyToken',auth.verifyToken, async (req,res) => {
    res.send(req.user);
});

module.exports = router;