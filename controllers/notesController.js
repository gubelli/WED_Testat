var store = require("../services/noteStore.js");

module.exports.showIndex = function(req, res)
{
    res.render("index");
};

module.exports.createNote = function(req, res)
{
    res.render("note");
};

module.exports.saveNote = function(req, res)
{
    var state = (req.body.state == 'on');
    var order = store.add(req.body.title, req.body.description, req.body.prio, req.body.due, state, function(err, order) {
        res.render("index");
    });
};

module.exports.editNote = function(req, res)
{
    store.get(req.params.id, function(err, note) {
        note.due = JSON.parse(note.due);
        res.render("note", note);
    });
};

/*
module.exports.deleteOrder =  function (req, res)
{
    store.delete(  req.params.id , function(err, order) {
        res.render("showorder", order);
    });
};
*/
