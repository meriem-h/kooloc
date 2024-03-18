const express = require("express");
const PollController = require("../controllers/PollController")

const router = express.Router()

router.get('/', PollController.readAll);
router.get('/chart/:id', PollController.getChart);
router.get('/:id', PollController.readOne);

module.exports = router;