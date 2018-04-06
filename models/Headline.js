var mongoose = require("mongoose");

//reference schema cosntructor

var Schema = mongoose.Schema;

//new user schema
var HeadlineSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	summary: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: false
	},
	note: [{
		type: Schema.Types.ObjectId,
		ref: "Note"
	}],
});

var Headline = mongoose.model("Headline", HeadlineSchema);

//export article model
module.exports = Headline;