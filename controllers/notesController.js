var store = require("../services/noteStore.js");

module.exports.showIndex = function(req, res)
{
    var filter = {};

    if(req.query.order){
        switch(req.query.order){
            case 'fdate':
                break;
            case 'cdate':
                break;
            case 'importance':
                break;
        }
    }else if(req.query.style == 'black'){

    }else if(req.query.filter == 'true'){
        filter = {finish: false};
    }
    store.all(filter,function(err,notes){
        //console.dir({notes : notes});
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
