var store = require("../services/noteStore.js");
var filterstore = require("../services/filterStore.js");
var moment = require('moment');

module.exports.showIndex = function(req, res)
{

    filterstore.set(req);

    //TODO: Due and Overdue
    store.all(filterstore.getShow(req), filterstore.getSorter(req),function(err,notes){
        var startDate = moment(new Date(),'YYYY-MM-DD');
        notes.forEach(function(note){
            if(JSON.parse(note.due)){
                var endDate = moment(JSON.parse(note.due),"YYYY-MM-DD");
                var diff = endDate.diff(startDate, 'days');
                if(diff < 1){
                    note.due = "Overdue";
                }else{
                    note.due = diff + " days left"
                }
            }
            ;
        });
        res.render("index",{notes : notes, filter: req.session.filter});
    });
};

module.exports.createNote = function(req, res)
{
    res.render("note");
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

