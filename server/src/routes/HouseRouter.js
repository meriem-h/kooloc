const express = require("express");
const HouseSController = require("../controllers/HouseController")

const router = express.Router()

router.post('/create', HouseSController.createHouse);
router.post('/join', HouseSController.joinHouse);
router.get('/:id', HouseSController.show);

module.exports = router;