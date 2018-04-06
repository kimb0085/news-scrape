/****************************************************************************
 ****************************************************************************
    Initialize
*****************************************************************************
*****************************************************************************/
// Import packages
var express = require("express");
var path    = require("path");

// For web scraping
var cheerio = require("cheerio");
var request = require("request");

// Create an instance of Router
var router = express.Router();

// Talk to the models
var Headline  = require(path.join(__dirname, "..", "models", "Headline.js"));
var index = require(path.join(__dirname, "..", "models", "index.js"));
var Note  = require(path.join(__dirname, "..", "models", "Note.js"));
var User = require(path.join(__dirname, "..", "models", "User.js"));

var url_forum  = "http://www.neogaf.com/forum/forumdisplay.php?f=2";
var url_thread = "http://www.neogaf.com/forum/showthread.php?t=";



/****************************************************************************
 ****************************************************************************
    Set up routes
*****************************************************************************
*****************************************************************************/
router.get("/scrape", function(req, res){
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

router.post("/headlines/:id", function(req, res){
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

router.delete("/delete-note/:id", function(req, res){
    Note.remove({"_id": req.params.id}, (err, res) => {
        if (err) throw err;

        res.redirect(`/shownote_${req.params.id}`);

    });
});


module.exports = router;