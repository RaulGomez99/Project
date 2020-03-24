const User = require('../models/user.model');
const auth = require('../models/auth.model');


exports.verifyLogin = (req,res) => {
    console.log(req.body)
    User.findAll({where:{
        username:req.body.user
    }}).then(resp=>{
        if(resp.length){
            const user = resp[0].dataValues;
            if(auth.verifyPassword(req.body.password,user.password)){
                const token = auth.createToken(user);
                res.send({token,user});
            }else{
                res.send({error:"Password erroneo"});
            }
        }else{
            res.send({error: "Usuario no encontrado"});
        }
    }).catch(e=>{
        res.send({error:e});
    })
}