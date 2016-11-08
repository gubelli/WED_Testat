var store = require("../services/noteStore.js");
var moment = require('moment');

module.exports.showIndex = function(req, res)
{
    var filter = {};
    var sorter = {};

    //TODO: Save in session
    console.log(JSON.stringify(req.cookies));
    if(!req.session.filter){
        req.session.filter = {};
    }
    if(!req.session.style){
        req.session.style = {};
    }

    //TODO: Reverse filter
    if(req.query.order){
        switch(req.query.order){
            case 'fdate':
                sorter = {due: 1};
                break;
            case 'cdate':
                sorter = {create: 1};
                break;
            case 'importance':
                sorter = {prio: 1};
                break;
        }
    }else if(req.query.style == 'black'){
        req.session.style = 'black';
    }else if(req.query.filter == 'true'){
        req.session.filter = 'true';
        filter = {finish: false};
    }


    //TODO: Due and Overdue
    store.all(filter, sorter,function(err,notes){
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
        console.dir(notes);
        res.render("index",{notes : notes});
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

