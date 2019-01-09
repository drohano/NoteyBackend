var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var d = new Date();
var n = d.toString()

var NoteSchema = new Schema({
    heading: {type: String, required: true, max: 100, unique: true},
    content: {type: String, required: true, max: 1000},
    
});

module.exports = mongoose.model('Note', NoteSchema, "notey");