const express = require("express");
const ChatroomController = require("../controllers/ChatroomController")

const router = express.Router()

router.get('/', ChatroomController.readAll);
router.get('/:id', ChatroomController.readOne);

module.exports = router;