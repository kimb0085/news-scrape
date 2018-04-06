//this is for all the routes
var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

//require models
var db = require("../models");

var app = express();

//get requests
app.get("/", function(req, res){
	res.render("index");
});

//scrape information when user gets to the site
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

module.exports = app;