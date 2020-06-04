const passport = require('passport');
const authModel = require('../models/auth.model');

module.exports = {
    logIn,
    logOut: (req,res) =>{res.clearCookie('jwt'); res.send('Cookie eliminada')},
    findUser
}

function logIn(req,res,next) {
    const { User } = req.app.locals.db;
    passport.authenticate('login', async (err, authUser,info) => {
        if(err) console.log(err)
        if(info!==undefined){
            console.log(info.message);
            res.send(info)
        }else{
            req.logIn(authUser, async error=>{
                if(error) res.send({ error });
                const user = await User.findOne({ where: { username:authUser.username }});
                const token = authModel.createToken(user, authModel.privateKey);
                res.cookie('jwt', token, authModel.optsCookie);
                res.status(200).send({token, user});
            });
        }
    })(req,res,next);
}

function findUser(req,res,next) {
    passport.authenticate('jwt',{session:false}, (err, user, info) => {
        if(err) console.log(err);
        if(info!==undefined){
            res.send(info);
        }else{
            res.status(200).send({
                user,
                auth:true
            })
        }
    })(req,res,next)
}