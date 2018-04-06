//dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

//list on a port
var PORT = 3000;
//require models
var db = require("./models");
//initialize express
var app = express();
//configure middlewar
//morgan logger to log requests
app.use(logger("dev"));
//body parser for form submissions
app.use(bodyParser.urlencoded({extended: false}));
//express static for images and css and such
app.use(express.static("public"));

//mongo
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  // useMongoClient: true
});
//handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//routes
//first let's get
app.get("/", function(req, res){
	db.Headline.find({})
		.then(function(data){
			var targetObject = {
				headlines: data
			}
			res.render("index", targetObject);
		})
			.catch(function(err){
				res.json("an error definitely happened: ", err);
			});
});
//"get" a scrape
app.get("/scrape", function(req, res){
	request("https://getpocket.com/explore/trending?src=top_navbar", function(error, response, html){
		var $ = cheerio.load(html);

		$("article.item_article").each(function(i, element){
			var results = [];
			var title = $(element).children("a").text();
			var link = $(element).children("a").attr("href");
			var summary = $(element).children("a").text();
			var image = $(element).children("a").attr("src", "<img>");
			
			db.Headline.create(results)
				.then(function(dbHeadline){
					console.log(dbHeadline);
				}).catch(function(err){
					return res.json(err);
			});
		});
	});
	res.send("scraped!");	
});
//get headlines in db
app.get("/headlines", function(req, res){
	db.Headline.find({})
		.then(function(dbHeadline){
			res.json(dbHeadline);
		})
		.catch(function(err){
			res.json("Yup, there are errors: ", err);
	});
});
//article by id 
app.get("/headlines/:id", function(req, res){
	db.Headline.findOne({_id: req.params.id})
		.populate("comment")
		.then(function(dbHeadline){
			res.json(dbHeadline);
		})
		.catch(function(err){
			res.status(404).json("oh the prickly error: ");
	});
});
//return notes as json
app.get("/notes", function(req, res){
	db.Note.find({})
		.then(function(dbNote){
			res.json(dbNote);
		})
		.catch(function(err){
			res.status(404).json("oh the prickly error: ");
	});
});
//notes by id
app.get("/notes/:id", function(req, res){
	db.Note.findOne({_id: req.params.id})
		.populate("userAssociation")
		.then(function(dbNote){
			res.json(dbNote);
		})
		.catch(function(err){
			res.status(404).json("oh the prickly error: ");
	});
});
//users as json
app.get("/users", function(req, res){
	db.User.find({})
		.then(function(dbUser){
			res.json(dbUser);
		})
		.catch(function(err){
			res.status(404).json("oh the prickly error: ");	
	});
});
//posting
app.post("/headlines/:id", function(req, res){
	db.Note.create(req.body)
		.then(function(dbNote){
			return db.Headline.findOneAndUpdate(
				{_id: req.params.id},
				{$push: {
					comment: {$each: [dbNote._id], $position: 0}
				}},
				{new: true});
			})
			.then(function(dbUser){
				return db.Note.findOneAndUpdate(
					{_id: req.params.id},
					{$push: {userAssociation: dbUser._id}},
					{new: true});
			})
			.then(function(dbHeadline){
				res.json(dbHeadline)
			})
			.catch(function(err){
				res.json(err);
		});
});
//psot new user
app.post("/newUser", function(req, res){
	db.User.create({
		username: req.body.username,
		email: req.body.email
	},
	function(err, inserted){
		if(err){
			console.log("this error was thrown: ", err);
		} else {
			console.log(inserted);
			res.json(inserted);
		}
	});
});
//start the server
app.listen(PORT, function(){
	console.log("Listening on Port: 3000");
});