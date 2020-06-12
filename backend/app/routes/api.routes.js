const router = require('express').Router();

const LoginController       = require('../controller/login.controller');
const PaypalController      = require('../controller/paypal.controller');
const TournametController   = require('../controller/tournament.controller');
const UserController        = require('../controller/user.controller');

router.post('/hola/:id', (req,res)=>{

    res.send({param:req.params.id,body:req.body})
})

router.post('/users/register'              , LoginController.register);
router.post('/users/login'                 , LoginController.logIn);
router.get( '/users/logout'                , LoginController.logOut);
router.get( '/users/checkUser/:username'   , LoginController.checkUser);
router.get( '/users/checkEmail/:email'      , LoginController.checkEmail);

router.get('/users/findUser'      , LoginController.findUser,  LoginController.returnUser);
router.post('/users/editLogo/:id' , LoginController.findUser,  UserController.editUser);

router.get('/paypal/payment/:id' , PaypalController.payment);
router.get('/paypal/success'     , PaypalController.success);
router.get('/paypal/cancel'      , PaypalController.cancel);

router.get('/tournament/:id'  ,TournametController.getTournament);

router.post(  '/tournaments'                      , LoginController.findUser, TournametController.addTournament);
router.delete('/tournaments/:id'                  , LoginController.findUser, TournametController.deleteTournament);
router.post(  '/tournaments/addParticipant/:id'   , LoginController.findUser, TournametController.addParticipant);
router.delete('/tournaments/deleteParticipant/:id', LoginController.findUser, TournametController.deleteParticipant);
router.post(  '/tournaments/startTournament/:id'  , LoginController.findUser, TournametController.startTournament);
router.post(  '/tournaments/pairResult/:id'       , LoginController.findUser, TournametController.pairResult);
router.post(  '/tournaments/changeRound/:id'      , LoginController.findUser, TournametController.changeRound);
router.post(  '/tournaments/addCSV/:id'           , LoginController.findUser, TournametController.addCSV)
router.post(  '/tournaments/deshacer/:id'         , LoginController.findUser, TournametController.deshacer)
router.get(   '/tournaments/returnImg/:id'       , TournametController.returnImg)

module.exports = router;