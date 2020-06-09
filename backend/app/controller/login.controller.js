const passport = require('passport');
const authModel = require('../models/auth.model');

module.exports = {
    logIn,
    logOut: (req, res) =>{res.clearCookie('jwt'); res.send('Cookie eliminada')},
    findUser,
    register,
    returnUser
}

function logIn(req,res,next) {
    const { User, Tournament } = req.app.locals.db;
    passport.authenticate('login', async (err, authUser,info) => {
        if(err) return res.send({msg:err})
        if(info!==undefined){
            res.send(info);
        }else{
            req.logIn(authUser, async error=>{
                if(error) res.send({ error });
                let user = await User.findOne({ where: { username:authUser.username }});
                if(!user){
                    user = await User.findOne({ where: { email:authUser.username }});
                    if(!user) return res.status(400).send({err:"No existe dicho usuario"})
                }
                const token = authModel.createToken(user, authModel.privateKey);
                res.cookie('jwt', token, authModel.optsCookie);
                const userReturn = await User.findByPk(user.id,{include:[{model:Tournament}]});
                res.status(200).send({token, user:userReturn});
            });
        }
    })(req,res,next);
}

async function register(req,res) {
    const { User } = req.app.locals.db;
    const {name, lastName:last_name, email, username, password} = req.body;
    const encriptedPassword = authModel.encryptPassword(password);
    const resp = await User.create({name, last_name, email, username, password:encriptedPassword});
    res.send({success:"success"});
}

function findUser(req,res,next) {
    passport.authenticate('jwt',{session:false}, (err, user, info) => {
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
    const { User, Tournament } = req.app.locals.db;
    res.send({user:await User.findByPk(req.user.id,{include:[{model:Tournament}]})});
}