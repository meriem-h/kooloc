const jwt = require("jsonwebtoken")
const db = require('../models/index')
const authUtils = require("../utils/Auth.utils")


exports.login = async (req, res) => {
    const body = req.body

    try {
        const user = await db.User.findOne({
            where: {
                email: body.email,
            },
            include: [
                {
                    model: db.HouseShare,
                    as: "houseShare",
                    include: [
                        {
                            model: db.User,
                            as: "users"
                        }
                    ]

                }
            ]
        });

        if (!user) throw 'NO USER'
        const checkPassword = await authUtils.checkPassword(body.password, user.password);

        if (checkPassword) {

            const payload = {
                id: user.id,
                email: user.email,
                firstname: user.firstName,
                lastname: user.lastName,
                houseShareId: user.houseShareId
            }

            const token = await authUtils.signJWT(
                payload,
                process.env.TOKEN_SECRET
            );

            res.json({
                status: "OK",
                response: {
                    token: token,
                    user: user
                }
            });
        }

    } catch (error) {
        console.log(error)
        res.json({ error: error });
    }
}

exports.register = async (req, res) => {
    const body = req.body;
    let hashedPassword = ""
    console.log(body.password.length >= 8)

    if (body.password.length >= 8) {
        hashedPassword = await authUtils.passwordHash(body.password)
    }

    try {
        const user = await db.User.create({
            email: req.body.email,
            firstName: body.firstname,
            lastName: body.lastname,
            password: hashedPassword,
            phone: ''
        })
        res.json({ status: "OK", response: user });
    } catch (err) {
        res.json({ status: "NOK", response: err.errors });
    }

}

exports.authByToken = (req, res) => {
    const token = req.headers.authorisation;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }else{
                try{
                    const userAuth = await db.User.findOne({
                        where: {
                            email: user.email,
                        },
                        include: [
                            {
                                model: db.HouseShare,
                                as: "houseShare",
                                include: [
                                    {
                                        model: db.User,
                                        as: "users"
                                    }
                                ]
            
                            }
                        ]
                    });
                    res.json({ status: "OK", user: userAuth });
                    
                }catch(error){
                    console.log(error)
                    res.json({ status: "KO", error});
                }
               
            }
        });

    } else {
        res.sendStatus(401);
    }
}

exports.isAuth = (req, res) => {
    if (req.user) {
        res.sendStatus(200)
    }
}   