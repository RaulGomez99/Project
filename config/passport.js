const passport = require('passport');
const {Strategy:LocalStrategy} = require('passport-local');
const {Strategy:JwtStrategy} = require("passport-jwt");
const {Strategy:GoogleStrategy} = require( 'passport-google-oauth2' );
const ExtractJWT = require("passport-jwt").ExtractJwt;

const {verifyPassword, privateKey} = require('../app/models/auth.model');
const {User, UserDetail} = require('../app/models/db.model');

passport.use('login',new LocalStrategy(
    {
        usernameField:"username",
        passwordField:"password",
        session: true
    }, (username, password, done) => {
        console.log(username);
        try{
            User.findOne({
                where:{
                    username
                }
            }).then(user => {
                if(user===null){
                    return done(null,false,{msg:'Nombre de usuario erroneo'})
                } else {
                    const response = verifyPassword(password,user.password);
                    if(!response){
                        console.log("Contraseña erronea");
                        return done(null, false, {msg:'Contraseña erronea'})
                    }
                    console.log('Usuario encontrado y autentificado');
                    return done(null, user);
                }
            })
        }catch(err){
            done(err);
        }
    }
))

const opts = {
    jwtFromRequest:(req) => req.cookies.jwt,
    secretOrKey:privateKey
}

passport.use('jwt', new JwtStrategy(opts,(jwt_payload,done) => {
    try{
        User.findOne({
            where:{
                username:jwt_payload.user.username
            }
        }).then(user => {
            if(user){
                console.log('Usuario correcto');
                done(null, user)
            }else{
                console.log('Usuario no encontrado');
                done(null,false,{msg:'Usuario no encontrado'});
            }
        })
    }catch (err){
        done(err);
    }
}))

passport.use('google', new GoogleStrategy({
    clientID: '465593342085-eml9f24acl3r07im82nhesve9drhvoc2.apps.googleusercontent.com',
    clientSecret: 'BCvAB4jeVV8M5DWpoRLXd3Xq',
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback   : true
},(request,accesToken,refreshToken,profile,done) => {
    try{
        console.log(profile);
        done(null,null)
    }catch (err){
        done(err);
    }
}))