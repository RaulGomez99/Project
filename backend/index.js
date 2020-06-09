const express       = require('express');
const path          = require('path');
const passport      = require('passport');
const cookieParser  = require('cookie-parser')
const Sequelize     = require("sequelize");
const cors          = require("cors");
const app           = express();

require('dotenv').config();

(async function initApp(){
    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());

    initDB();
    initRoutesReact();
    await initPassport();
    
    const port = process.env.PORT || 3001;
    app.use("/api",require('./app/routes/api.routes'));
    app.use(express.static(path.join(__dirname, 'Frontend/build')));
    app.listen(port, () => console.log("Listen on port "+port));
})();

async function initPassport(){
    const passportModel = require('./app/models/passport.model');
    passport.serializeUser  ((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
    passport.use('login', passportModel.loginStrategy());
    passport.use('jwt'  , passportModel.jwtStrategy());
    app.use(passport.initialize());
    app.use(passport.session());
}

function initRoutesReact(){
    const routesReact = ["inicio","about","dashboard","register","login"];
    routesReact.forEach(element =>{
        app.get('/'+element, (req,res) =>{res.sendFile(path.join(__dirname+'/Frontend/build/index.html'))});
    });
}

function initDB(){
    const { DB_USER, DB_PASSWORD, DB_DATABASE, DB_DIALECT, DB_HOST } = process.env;
    const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        dialect: DB_DIALECT,
        define: { timestamps:false } ,
        logging: false
    });
    let db = {};

    //Import all the sequlize models
    db['User']       = sequelize['import']('./app/models/user.model.js');
    db['Tournament'] = sequelize['import']('./app/models/tournament.model.js');

    // Do all the relations
    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) { db[modelName].associate(db); }
    });

    db.sequelize = sequelize;
    app.locals.db = db;
}