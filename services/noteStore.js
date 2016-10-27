var Datastore = require('nedb');
var db = new Datastore({ filename: './data/note.db', autoload: true });

function Note(title, desc, prio, due, state)
{
    this.title = title;
    this.desc = desc;
    this.prio = prio;
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

function publicFinish(id, state, callback) {
    db.update({_id: id}, {$set: {"finish": state}}, {}, function (err, doc) {
        publicGet(id,callback);
    });
}

function publicGet(id, callback)
{   db.findOne({ _id: id }, function (err, doc) {
    callback( err, doc);
});
}

function publicAll(filter, callback)
{
    db.find(filter, function (err, docs) {
        callback( err, docs);
    });
}

/*
 // Let's say the database contains these 4 documents
 // doc1 = { _id: 'id1', planet: 'Mars', system: 'solar', inhabited: false, satellites: ['Phobos', 'Deimos'] }
 // doc2 = { _id: 'id2', planet: 'Earth', system: 'solar', inhabited: true, humans: { genders: 2, eyes: true } }
 // doc3 = { _id: 'id3', planet: 'Jupiter', system: 'solar', inhabited: false }
 // doc4 = { _id: 'id4', planet: 'Omicron Persei 8', system: 'futurama', inhabited: true, humans: { genders: 7 } }

 // No query used means all results are returned (before the Cursor modifiers)
 db.find({}).sort({ planet: 1 }).skip(1).limit(2).exec(function (err, docs) {
 // docs is [doc3, doc1]
 });

 // You can sort in reverse order like this
 db.find({ system: 'solar' }).sort({ planet: -1 }).exec(function (err, docs) {
 // docs is [doc1, doc3, doc2]
 });

 // You can sort on one field, then another, and so on like this:
 db.find({}).sort({ firstField: 1, secondField: -1 }) ...   // You understand how this works!
 */

module.exports = {add : publicAddNote, state : publicFinish, get : publicGet, all : publicAll};