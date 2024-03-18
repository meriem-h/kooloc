const express = require("express");
const ShoppingListController = require("../controllers/ShoppingListController")

const router = express.Router()

router.get('/', ShoppingListController.readAll);
router.get('/:id', ShoppingListController.readOne);

module.exports = router;