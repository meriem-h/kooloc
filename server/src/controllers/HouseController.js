const db = require('../models/index')
const { v4: uuidv4 } = require('uuid');
const { signJWT } = require("../utils/Auth.utils")

exports.createHouse = async (req, res) => {
    const body = req.body.data
    let uuid = uuidv4();

    const houseShare = await db.HouseShare.create({
        name: req.body.data,
        uui: uuid
    })
    
    const user = await db.User.findByPk(req.user.id)
    
    await user.setHouseShare(houseShare);
    const payload = {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        houseShareId: user.houseShareId
    }

    let chatroom = await db.Chatroom.create({
        name: houseShare.name,
        isPrivate: false,
        CreatedBy: null,
        houseShareId: houseShare.id
    })

    chatroom.addUser(user)

    const token = await signJWT(
        payload,
        process.env.TOKEN_SECRET
    );

    res.json({
        user: payload,
        token: token
    })


}


exports.joinHouse = async (req, res) => {

    const user = await db.User.findByPk(req.user.id)
    const uuid = req.body.data
    const houseShare = await db.HouseShare.findOne({ where: { uui: uuid } });
    await user.setHouseShare(houseShare);

    const payload = {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        houseShareId: user.houseShareId
    }

    const token = await signJWT(
        payload,
        process.env.TOKEN_SECRET
    );

    res.json({
        user: payload,
        token: token
    })
}

exports.show = async (req, res) => {
    const houseShareId = req.params.id

    const house = await db.HouseShare.findOne({ 
        where : { 
            id : houseShareId
        },
        include : [
            {
                model: db.User,
                as: 'users'
            }
        ]
    })

    res.json({
        house: house
    })
}