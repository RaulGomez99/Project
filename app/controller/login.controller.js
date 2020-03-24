const User = require('../models/user.model');
const passport = require('passport');
const auth = require('../models/auth.model');


exports.verifyLogin = (req,res,next) =>  {
    passport.authenticate('login',(err,user,info) => {
        if(err) console.log(err)
        if(info!==undefined){
            console.log(info.message);
            res.send(info)
        }else{
            req.logIn(user,err => {
                User.findOne({
                    where:{
                        username:user.username
                    }
                }).then(user => {
                    const token = auth.createToken(user,auth.privateKey);
                    res.cookie("jwt", token, auth.optsCookie);
                    res.status(200).send({
                        token:token,
                        user:user
                    })
                })
            })
        }
    })(req,res,next);
}

exports.findUser = (req,res,next) => {
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