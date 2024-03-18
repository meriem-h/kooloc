const db = require('../models/index')

exports.add = async (req, res) => {
    const ShoppingLists  = await db.ShoppingList.findAll();
    res.json(ShoppingLists);
}
