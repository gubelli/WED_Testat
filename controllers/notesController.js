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
    var order = store.add(req.body.name, "unkown", function(err, order) {
        res.render("succeeded", order);
    });
};

module.exports.editNote = function(req, res)
{
    store.get(req.params.id, function(err, note) {
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
