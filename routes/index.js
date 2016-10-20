var express = require('express');
var router = express.Router();

var notes = require('../controllers/notesController.js');

router.get("/", notes.showIndex);
router.get("/notes", notes.createNote);
router.post("/notes", notes.saveNote);
router.get("/notes/:id/", notes.editNote);

module.exports = router;
