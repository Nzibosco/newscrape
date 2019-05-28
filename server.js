// Dependencies
var express = require("express");
//var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
//require Morgan to log http request
var logger = require("morgan");

// require mongoose to make db schemas and models
var mongoose = require("mongoose");

// Initialize Express
var app = express();
var port = process.env.PORT || 3200; 

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Use morgan logger for logging requests
app.use(logger("dev"));

// Database configuration
var databaseUrl = "nytdb";
//var collections = ["timesCollections"];

// Require all models
var db = require("./models");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/" + databaseUrl, { useNewUrlParser: true });

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.Article.find({}, function(error, data) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(data);
    }
  });
});

//delete database content

app.get("/delete", function(req, res) {
  // Remove every article from the articles collection
  db.Article.remove({}, function(error, response) {
    // Log any errors to the console
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      // Otherwise, send the mongojs response to the browser
      // This will fire off the success function of the ajax request
      console.log(response);
      res.send(response);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request via axios for the news section of `ycombinator`
  axios.get("https://www.nytimes.com/section/world").then(function(response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);
    // For each element with a "title" class
    $(".css-4jyr1y").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children("a").children("h2").text();
      var summary = $(element).children("a").children("p").text();
      var link = "www.nytimes.com" + $(element).children("a").attr("href");

      var result = {};
      result.title = title;
      result.summary = summary;
      result.link = link;

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  res.send("scrape complete");
});
});

// find articles saved when save article button is clicked. 
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, grab its content and post it in savedArticles collections.
      var saved = {};
      saved.title =dbArticle.title;
      saved.summary = dbArticle.summary;
      saved.link = dbArticle.link;

      db.SavedArticle.create(saved).then(function(done){
                  // View the added result in the console
                  console.log(done);
                })
                .catch(function (err) {
                  // If an error occurred, log it
                  console.log(err);
                });
      })

      // after posting the article in savedArticle collection, delete it from the article collection.
      .then(function(){
        db.Article.remove({_id: req.params.id }, function(finish){
          console.log(finish);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
      });
      
    });
// Listen on port 3200
app.listen(port, function() {
  console.log("App running on port 3200!");
});