const express = require("express");
const DocumentController = require("../controllers/DocumentController.js")

const router = express.Router()

router.get('/', DocumentController.readAll);
router.get('/:id', DocumentController.readOne);

module.exports = router;