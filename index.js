const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser')
const routesReact = ["inicio","about","dashboard","register","login"];

const app = express();
app.use(cookieParser());

app.use(express.json());

require('./config/passport');

app.use(express.static(path.join(__dirname, 'Frontend/build')));

app.use(passport.initialize());
app.use(passport.session());

routesReact.forEach(element =>{
    app.get('/'+element, (req,res) =>{res.sendFile(path.join(__dirname+'/Frontend/build/index.html'))});
});

app.use("/api/users",require('./app/routes/login.routes'));

const port = process.env.PORT || 5000;
app.listen(port);


console.log('App is listening on port ' + port);