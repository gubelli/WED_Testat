var store = require("../services/noteStore.js");
var filterstore = require("../services/filterStore.js");
var moment = require('moment');

module.exports.showIndex = function(req, res)
{
    filterstore.set(req);

    store.all(filterstore.getShow(req), filterstore.getSorter(req),function(err,notes){
        var startDate = moment(new Date(),'YYYY-MM-DD');
        notes.forEach(function(note){
            if(JSON.parse(note.due)){
                var endDate = moment(JSON.parse(note.due),"YYYY-MM-DD");
                var diff = endDate.diff(startDate, 'days');
                if(diff < 1){
                    note.due = "Overdue";
                } else if (diff < 7) {
                    note.due = diff + " days left";
                } else if (diff < 30) {
                    note.due = Math.round(diff / 7) + " weeks left";
                } else {
                    note.due = Math.round(diff / 30) + " months left";
                }
            }
        });
        res.render("index",{notes : notes, filter: req.session.filter});
    });
};

module.exports.createNote = function(req, res)
{
    res.render("note",{filter : req.session.filter});
};

module.exports.saveNote = function(req, res)
{
    var state = (req.body.state == 'on');
    store.add(req.body.title, req.body.description, req.body.prio, req.body.due, state, function(err, note) {
        //Show Index
        res.redirect("/");
    });
};

module.exports.editNote = function(req, res)
{
    store.get(req.params.id, function(err, note) {
        note.due = JSON.parse(note.due);
        res.render("note", note);
    });
};

module.exports.updateNote = function (req, res) {
    store.state(req.params.id,function(err,note){
        //Show Index
        res.redirect("/");
    });
};

module.exports.saveEdit = function(req,res){
    var state = (req.body.state == 'on');
    var id = req.params.id;

    store.save(id, req.body.title, req.body.description, req.body.prio, req.body.due, state, function(err, note) {
        //Show Index
        res.redirect("/");
    });
};

