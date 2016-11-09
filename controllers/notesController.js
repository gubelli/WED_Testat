var store = require("../services/noteStore.js");
var moment = require('moment');

module.exports.showIndex = function(req, res)
{
    var filter = {};
    var sorter = {};

    if(!req.session.filter){
        req.session.filter = {};
    }
    if(!req.session.style){
        req.session.style = {};
    }

    //TODO: Reserve ordering
    if(req.query.order){
        switch(req.query.order){
            case 'fdate':
                sorter = {due: 1};
                break;
            case 'rfdate':
                sorter = {due: -1};
                break;
            case 'cdate':
                sorter = {create: 1};
                break;
            case 'rcdate':
                sorter = {create: -1};
                break;
            case 'importance':
                sorter = {prio: 1};
                break;
            case 'rimportance':
                sorter = {prio: -1};
                break;
        }
    }

    //TODO: Fix save and restore with session
    if(req.query.style){
        if(req.query.style == 'black'){
            req.session.style = true;
        }else{
            req.session.style = false;
        }
    }

    if(req.query.filter){
        if(req.query.filter == 'true'){
            req.session.filter = true;
            filter = {finish: false};
        }else{
            req.session.filter = false;
            filter = {};
        }
    }else{
        if(req.session.filter){
            filter = {finish: false};
        }
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
        res.render("index",{notes : notes, style: req.session.style, filter: req.session.filter});
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

