const db = require('../models/index');

exports.readAll = async (req, res) => {
    const houseShareId = req.query.id;
    const userId = req.query.userId;

    const liste = await db.Chatroom.findAll({
        where: {
            isPrivate: false
        },
        include : [
            {
                model: db.HouseShare,
                as: 'houseShare',
                required: true,
                where:
                {
                    id: houseShareId
                }
            }
        ]
    });

    const private_liste = await db.Chatroom.findAll({
        where: {
            houseShareId: houseShareId,
            isPrivate: true
        },
        include: [
            {
                model: db.User,
                required: true,
                where:
                {
                    id: userId
                }
            }
        ]
    });

    const full_list = liste.concat(private_liste);

    res.json(full_list);
}

exports.readOne = async (req, res) => {
    chatroom = await db.Chatroom.findOne({
        where: { id: req.params.id },
        include: [
            {
                model: db.ChatroomMessage,
                as: 'messages',
                include: "user"
            },
            {
                model: db.User
            }
        ]
    })
  
    res.json(chatroom)
}