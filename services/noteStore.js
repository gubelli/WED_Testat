var Datastore = require('nedb');
var db = new Datastore({ filename: './data/note.db', autoload: true });

function Note(title, desc, prio, due, state)
{
    this.title = title;
    this.desc = desc;
    this.prio = parseInt(prio);
    this.due = JSON.stringify(due);
    this.create = JSON.stringify(new Date());
    this.finish = state;
}


function publicAddNote(title, desc, prio, due, state, callback)
{
    var note = new Note(title, desc, prio, due, state);

    db.insert(note, function(err, newDoc){
        if(callback){
            callback(err, newDoc);
        }
    });
}

function publicFinish(id, callback) {
    publicGet(id, function (err, doc) {
        if(!err){
            var state = !doc.finish;
            db.update({_id: id}, {$set: {"finish": state}}, {}, function (err, doc) {
                callback(err,doc);
            });
        }
    })

}

function publicSave(id, title, desc, prio, due, state, callback){
    publicGet(id, function(err, doc){
        if(!err){
            db.update({_id: id},{$set: {"title": title, "desc": desc, "prio": prio, "due": JSON.stringify(due), "finish": state}},{}, function (err, doc){
                callback(err,doc);
            });
        }
    })
}

function publicGet(id, callback)
{   db.findOne({ _id: id }, function (err, doc) {
        callback( err, doc);
    });
}

function publicAll(filter, sorter, callback)
{
    db.find(filter).sort(sorter).exec( function (err, docs) {
        callback( err, docs);});
}

module.exports = {add : publicAddNote, state : publicFinish, get : publicGet, all : publicAll, save: publicSave};