const passport = require('passport');
const {Strategy:LocalStrategy} = require('passport-local');
const {Strategy:JwtStrategy} = require("passport-jwt");

const authModel = require('./auth.model');

module.exports = {
    loginStrategy,
    jwtStrategy,
}

const opts = {
    jwtFromRequest:(req) => req.headers.authtoken,
    secretOrKey:authModel.privateKey,
    passReqToCallback : true
}

function loginStrategy(){
    return new LocalStrategy(
        {
            usernameField:"username",
            passwordField:"password",
            session: true, 
            passReqToCallback: true
        }, async (req, username, password, done) => {
            const { User } = req.app.locals.db;
            try{
                let user = await User.findOne({where:{username}});
                if(user===null){
                    user = await User.findOne({where:{email:username}});
                    if(user===null) done(null,false,{msg:'Nombre de usuario erroneo'});
                } 
                const response = authModel.verifyPassword(password, user.password);
                if(!response) return done(null, false, {msg:'Contraseña erronea'});
                return done(null, user);
            }catch(err){
                done(err);
            }
        }
    )
}

function jwtStrategy(){
    return new JwtStrategy(opts, async (req, jwt_payload, done) => {
        const { User } = req.app.locals.db;
        try{
            const user = await User.findOne({where:{username:jwt_payload.user.username}});
            if(!user) done(null,false,{msg:'Usuario no encontrado'});
            done(null, user);
        }catch(err){
            done(err);
        }
    })
}