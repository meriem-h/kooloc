const db = require('../models/index')


exports.create = async (req, res) => {
    const body = req.body
    const user = req.user

    try {
        const schedule = await db.Event.create({
            title: body.title,
            start: body.start,
            end: body.end,
            description: body.description,
            userId: user.id,
            houseShareId: user.houseShareId,
        })

        res.json({ status: 200 });
        if (!schedule) throw 'CREATE EVENT SCHEDULE FAIL'
    } catch (error) {
        console.log("ERR")
        res.json({ error: error });
    }
}

exports.show = async (req, res) => {
    const user = req.user
    
    try {
        const users = await db.User.findAll({});

        const schedule = await db.Event.findAll({ where: { houseShareId: user.houseShareId } });

        schedule.forEach(element => {

            users.forEach(value => {
                if (value.dataValues.id == element.dataValues.userId) {
                    element.dataValues.UserId = value.dataValues
                }
            });

            if (element.dataValues.end) {
                element.dataValues.dateEnd = element.dataValues.end
                const date = new Date(element.dataValues.end);
                date.setDate(date.getDate() + 1)
                element.dataValues.end = date.toISOString().substring(0, 10)
            }
        });

        res.json({ status: 200, data: schedule });
        if (!schedule) throw 'SHOW ALL EVENT SCHEDULE FAIL'
    } catch (error) {
        console.log(error)
        console.log(user);
        res.json({ error: error });
    }
}

exports.delete = async (req, res) => {
    const body = req.body
    
    try {
        
        const schedule = await db.Event.destroy({
            where: {
                id: body[0].id
            }
        });
        if (!schedule) throw `DELETE EVENT SCHEDULE FAIL`
    } catch (error) {
        console.log("ERR DELETE EVENT SCHEDULE FAIL")
        res.json({ error: error });
    }
}
