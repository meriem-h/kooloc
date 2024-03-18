const jwt = require("jsonwebtoken")

exports.jwtCheck = async (req, res, next) => {
    // console.log("TOKEN",req.headers.authorisation.split(" ")[1])
    let token = req.headers.authorisation.split(" ")[1]

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            res.sendStatus(403)
        } else {
            req.user = decoded
            next()
        }
    });
}