const db = require('../models/index')

exports.readAll = async (req, res) => {
    const category = await db.ExpenseCategory.findAll();
    res.json(category);
}