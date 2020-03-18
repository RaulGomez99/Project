const md5 = require('md5');
const User = require('../models/user.model');


exports.getAll = (req,res) => {
    User.findAll({where:{
        username:req.body.user,
        password:md5(req.body.password)
    }}).then(resp=>{
        console.log(resp.length)
        if(resp.length){
            res.send(resp[0]);
        }else{
            res.send({});
        }
    }).catch(e=>{
        res.send("");
    })
}