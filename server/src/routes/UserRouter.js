const express = require("express");
const UserController = require("../controllers/UserController")

const router = express.Router()

router.post('/quit', UserController.quit);
router.post('/:id', UserController.update);

module.exports = router;