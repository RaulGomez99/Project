const passport = require('passport');
const authModel = require('../models/auth.model');

module.exports = {
    logIn,
    logOut: (req, res) =>{res.clearCookie('jwt'); res.send('Cookie eliminada')},
    findUser,
    register,
    returnUser,
    checkUser,
    checkEmail
}

function logIn(req,res,next) {
    const { User, Tournament, Participant } = req.app.locals.db;
    passport.authenticate('login', async (err, authUser,info) => {
        if(err) return res.send({msg:err})
        if(info){
            res.send({msg:info.msg});
        }else{
            req.logIn(authUser, async error=>{
                if(error) return res.send({ msg:error });
                let user = await User.findOne({ where: { username:authUser.username.toLowerCase() }});
                if(!user){
                    user = await User.findOne({ where: { email:authUser.username.toLowerCase() }});
                    if(!user) return res.status(400).send({err:"No existe dicho usuario"})
                }
                const token = authModel.createToken(user, authModel.privateKey);
                res.cookie('jwt', token, authModel.optsCookie);
                const userReturn = await User.findByPk(user.id,{include:[{model:Tournament}]});
                const participants = await Participant.findAll({where:{id_users:user.id},include:[{model:Tournament}]});
                userReturn.dataValues.tournamentParticipant = participants;
                res.status(200).send({user:userReturn, token});
            });
        }
    })(req,res,next);
}

async function register(req,res) {
    const { User } = req.app.locals.db;
    const {name, lastName:last_name, email, username, password} = req.body;
    let user = await User.findOne({ where: { username:username.toLowerCase() }});
    if(user) return res.send({msg:"Nombre de usuario ya existente"})
    user = await User.findOne({ where: { email:email.toLowerCase() }});
    if(user) return res.send({msg:"Email ya existente"})
    const encriptedPassword = authModel.encryptPassword(password);
    const resp = await User.create({name, last_name, email:email.toLowerCase(), username:username.toLowerCase(), password:encriptedPassword});
    res.send({success:"success"});
}

function findUser(req,res,next) {
    passport.authenticate('jwt',{session:false}, async (err, user, info) => {
        if(err) return res.send({msg:err});
        if(info!==undefined){
            return res.send({msg:info});
        }else{
            req.user = user;
            next();
        }
    })(req,res,next)
}

async function returnUser(req, res){
    const { User, Tournament, Participant } = req.app.locals.db;
    const user = await User.findByPk(req.user.id,{include:[{model:Tournament}]});
    user.tournaments = user.tournaments.map(tournament => {
        return {
            ...tournament.dataValues,
            key: tournament.dataValues.id
        }
    })
    const participants = await Participant.findAll({where:{id_users:user.id},include:[{model:Tournament}]});
    user.dataValues.tournamentParticipant = participants.map(participant=>participant.tournament);
    res.send({user: {...user.dataValues, password:undefined , tournaments: user.tournaments}});

}

async function checkUser(req, res){
    const { User } = req.app.locals.db;
    const { username } = req.params;
    const user = await User.findOne({ where: { username:username.toLowerCase() }});
    if(user) return res.send({res:true});
    return res.send({res:false})
}

async function checkEmail(req, res){
    const { User } = req.app.locals.db;
    const { email } = req.params;
    const user = await User.findOne({ where: { email:email.toLowerCase() }});
    if(user) return res.send({res:true});
    return res.send({res:false})
}