
const db = require('../models/index')

exports.readAll = async (req, res) => {
    const expenses = await db.Expense.findAll({
        include: [
            {
                model: db.ExpenseCategory,
                as: "expense"
            },
            {   
                model: db.User,
                as: 'user'
            }
        ]
    });
    res.json(expenses);
}


exports.getExpenseCard = async (req, res) => {
    const expenseCategories = await db.ExpenseCategory.findAll({
        include: [
            {
                model: db.Expense,
                as: "expenses"
            }
        ]
    })

    const expenseCard = [];

    expenseCategories.map(item => {

        let totalSpend = 0
        let expenseAmout = item.expenses;

        for (let i = 0; i < expenseAmout.length; i++) {
            totalSpend += expenseAmout[i].price;
        }

        let card = {
            name: item.name,
            sum: totalSpend / 1000,
            primaryColor: item.primaryColor,
            secondaryColor: item.secondaryColor
        }
        expenseCard.push(card)
    })

    res.json(expenseCard)
}

exports.readOne = async (req,res) => {
    let id = req.params.id
    const expense = await db.Expense.findAll({
        where:{
            id:id
        },
        include:[
            {
                model: db.ExpenseCategory,
                as: "expense"
            },
            {
                model: db.User,
                as: 'user'
            }
        ]
    });
    res.json(expense[0])
}