const db = require('../models/index')
const path = require('path')

exports.readAll = async (req, res) => {
    // console.log(req)
    const files = await db.File.findAll({
        where: {
            houseShareId: req.query.houseShareId
        },
        include: [
            {
                model: db.User,
                as: 'user'
            }
        ]
    });
    res.json(files);
}

exports.readOne = async (req, res) => {
    const file = await db.File.findByPk(req.params.id, {
        include: [
            {
                model: db.User,
                as: "user"
            }
        ]
    });

    if (file) {
        const filePath = path.join(__dirname, '../uploads', file.name);
        console.log(filePath)
        res.sendFile(filePath);
    }
}