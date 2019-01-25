var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    id: {type: String, required: true, max: 500},
    heading: {type: String, required: true, max: 100},
    content: {type: String, required: true, max: 1000},
    date: {type: String, required: true, max: 100},
    modifiedDate: {type: String, required: true, max: 100},
    isEdited:{type: Boolean, required: true}
    
});

module.exports = mongoose.model('Note', NoteSchema, "notey");