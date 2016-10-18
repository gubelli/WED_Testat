var express = require('express');
var router = express.Router();

var orders = require('../controllers/notesController.js');

router.get("/", orders.showIndex);
router.get("/notes", orders.createNote);
//router.post("/orders", orders.createPizza);
router.get("/notes/:id/", orders.editNote);
//router.delete("/orders/:id/", orders.deleteOrder);

module.exports = router;
