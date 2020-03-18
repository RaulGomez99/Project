const express = require('express');
const path = require('path');
const routesReact = ["inicio","about","dashboard","register","login"]

const app = express();

app.use(express.static(path.join(__dirname, 'Frontend/build')));

routesReact.forEach(element =>{
    app.get('/'+element, (req,res) =>{res.sendFile(path.join(__dirname+'/Frontend/build/index.html'))});
});

app.get('*', (req,res) => {
    res.send("Error 404");
})

app.use("/api/login",require('./app/routes/login.routes'));

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);