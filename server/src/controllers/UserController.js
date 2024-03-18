const db = require('../models/index')

exports.update = async (req, res) => {
    const body = req.body

    try{
        await db.User.update(
            {
                phone: body.phone
            },
            {
                where : {
                    id: body.id
                }
            }  
        )

        res.json("OK");

    }catch (error) {
        res.json(error)
    }
}

exports.quit = async (req, res) => {
    const body = req.body

    try {
        const user = await db.User.findOne({ where : { id : body.userId }});
        const house = await db.HouseShare.findOne({ where : { id : body.houseId }})
        
        await house.removeUser(user);

        res.json("OK");

    }catch(error){
        res.json(error);
    }

}