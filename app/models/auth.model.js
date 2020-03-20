const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const privateKey = "hasjfhasd";

module.exports.createToken = (user) => {
    console.log(user);
    const token = jwt.sign(user,privateKey,{expiresIn: 60*30})
    return token;
}

module.exports.verifyToken = (req,res,next) => {
    try{
        req.user = jwt.verify(req.headers.authtoken,privateKey);
        console.log(req.user)
        next();
    }catch{
        res.send({error:"Tiempo de sesion finalizado"})
    }
}

module.exports.encryptPassword = (password) => {
    const passwordEncripted = bcrypt.hashSync(password, 13);
    return passwordEncripted;
}

module.exports.verifyPassword = (myPlaintextPassword,hash) => {
    const verified = bcrypt.compareSync(myPlaintextPassword, hash);
    return verified;
}