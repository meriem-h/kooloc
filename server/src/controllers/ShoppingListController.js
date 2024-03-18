const db = require('../models/index');
const shoppinglist = require('../models/shoppinglist');

exports.readAll = async (req, res) => {
    const houseShareId = req.query.id;
    const userId = req.query.userId;

    const liste = await db.ShoppingList.findAll({
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
            }, 
            {
                model: db.ShoppingItem,
                as: 'shoppingItems'
            }
        ]
    });

    const private_liste = await db.ShoppingList.findAll({
        where: {
            HouseShareId: houseShareId,
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
            },
            {
                model: db.ShoppingItem,
                as: 'shoppingItems'
            }
        ]
    });

    const full_list = liste.concat(private_liste);

    res.json(full_list);
}


exports.readOne = async (req, res) => {
    shoppingList = await db.ShoppingList.findOne({
        where: { id: req.params.id },
        include: [
            {
                model: db.ShoppingItem,
                as: 'shoppingItems',
                include: "creator"
            },
            {
                model: db.User
            }
        ]
    })
  
    res.json(shoppingList)
}


