// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");

// Initialize Express
var app = express();
var port = process.env.PORT || 3200; 

app.use(express.static(__dirname + "public"));

// Database configuration
var databaseUrl = "nytdb";
var collections = ["timesCollections"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, data) {
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

app.delete("/delete", function(req, res){
    db.scrapedData.remove({}), function(error, data){
        if (error){
            console.log(error);
        }
        else{
            res.json(data);
        };
    };
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
      var link = $(element).children("a").attr("href");

      // If this found element had both a title and a link
      if (title && link) {
        // Insert the data in the scrapedData db
        db.timesCollection.insert({
          title: title,
          link: link,
          summary: summary
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
      }
    });
  });

  // Send a "Scrape Complete" message to the browser
  res.json(response);
});


// Listen on port 3200
app.listen(port, function() {
  console.log("App running on port 3200!");
});