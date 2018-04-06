//model for users
var mongoose = require("mongoose");

//reference schema constructor
var Schema = mongoose.Schema;

var UserSchema = new Schema ({
	username: {
		username: {
			type: String,
			trim: true,
			required: true
		},
		email: {
			type: String,
			required: true,
			match: [/.+\@.+\..+/, "Please enter a valid e-mail address"]
		},
		userCreated: {
			type: Date,
			default: Date.now
		}
	}
});

//create model
var User = mongoose.model("User", UserSchema);

//export
module.exports = User;