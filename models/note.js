var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    userName: {type: String, required: true, max: 100},
    heading: {type: String, required: true, max: 100},
    content: {type: String, required: true, max: 1000},
    date: {type: String, required: true, max: 100}
    
});

module.exports = mongoose.model('Note', NoteSchema, "notey");