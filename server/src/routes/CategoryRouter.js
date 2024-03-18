const express = require("express");
const CategoryController = require("../controllers/CategoryController.js")

const router = express.Router()

router.get('/', CategoryController.readAll);
// router.get('/:id', ShoppingListController.readOne);

module.exports = router;