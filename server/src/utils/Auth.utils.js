const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.passwordHash = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

exports.checkPassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}

exports.signJWT = async (payload, secret) => {
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return token;
}

exports.checkJwt = async (token,secret) => {
    jwt.verify(token,process.env.TOKEN_SECRET, (err,user) => {
        if(user){
            return user;
        } else {
            throw err
        }
    })
}