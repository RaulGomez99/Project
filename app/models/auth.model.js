const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const privateKey = "hasjfhasd";

module.exports.optsCookie = {
    expires: new Date(Date.now() + 36000000),
	secure: false, // set to true if your using https
	httpOnly: true
}

module.exports.createToken = (user, headers) => {
    const tokenObject = {
        user,
        browserData: headers
    }
    const token = jwt.sign(tokenObject,privateKey,{expiresIn: 60*30})
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

module.exports.privateKey = privateKey;