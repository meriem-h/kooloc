const express = require("express");
const ExpenseController = require("../controllers/ExpenseController.js")

const router = express.Router()

router.get('/', ExpenseController.readAll);
router.get('/expensecards', ExpenseController.getExpenseCard);
router.get('/:id', ExpenseController.readOne);

module.exports = router;