
const express = require("express");
const EventController = require("../controllers/EventController")

const router = express.Router()

router.get('/', EventController.show);
router.post('/create', EventController.create);
router.delete('/delete', EventController.delete);

module.exports = router;