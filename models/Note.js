var mongoose = require("mongoose");

//reference schema constructor
var Schema = mongoose.Schema;

//create a new NoteSchema
var NoteSchema = new Schema({
	noteTitle: {
		type: String,
		required: true
	},
	noteBody: {
		type: String,
		required: true
	}, 
	noteTime: {
		type: Date,
		default: Date.now
	},
	userAssociation: {
		type: Schema.Types.ObjectId,
		ref: "User"
	}
});

//create a model from above schema
var Note = mongoose.model("Note", NoteSchema);

//export
module.exports = Note;