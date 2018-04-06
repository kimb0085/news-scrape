// require mongoose
var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

// new Schema
var ScrapedDataSchema = Schema({
	title: {
		type: String,
		required: true,
		unique: true // make sure the article is not repeated again
	},
	image: {
		type: String,
		required: true
	},
	summary: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	}
});

// use the abvoe schema to make the ScrapedData model
var ScrapedData = mongoose.model('ScrapedData', ScrapedDataSchema);

// export the model so the server can use it
module.exports = ScrapedData;