const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const privateKey = "hasjfhasd";

const optsCookie = {
    expires: new Date(Date.now() + 36000000),
        secure: false,
        httpOnly: true
}

module.exports = {
    optsCookie,
    createToken,
    encryptPassword,
    verifyPassword,
    privateKey
}


function createToken(user, headers){
    const tokenObject = {
        user:{
            id: user.id,
            username: user.username
        },
        browserData: headers
    }
    const token = jwt.sign(tokenObject,privateKey,{expiresIn: 60*30})
    return token;
}

function encryptPassword(password){
    const passwordEncripted = bcrypt.hashSync(password, 13);
    return passwordEncripted;
}

function verifyPassword(myPlaintextPassword,hash){
    const verified = bcrypt.compareSync(myPlaintextPassword, hash);
    return verified;
}
