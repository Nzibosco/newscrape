$(document).ready(function(){

//get articles when scrape button is clicked

$("#scrape").on("click", function(){
    //tell the database to scrape articles first
    $.get("/scrape", function(response){
      console.log("scrape command sent!");
    });
    //proceed with getting all articles from the database
    $.get("/all", function(data){
        //loop through artciles and add one by one to the DOM
        for(var i = 0; i<data.length; i++){
            console.log(data[i]);

            // create Bootstrap card to holds data for each news article scrapped. 

            var title = data[i].title;
            var link = data[i].link;
            var summary = data[i].summary;
            var id = data[i]._id;
            
            //empty news div first and then append each database article
            //$(".news").empty();
            $(".news").prepend(
                "<div class = 'card'>"
                + "<div class = 'card-body'>"
                + "<a href='" + link + "'><h3 class = 'card-title'>" + title + "</h3></a>" + 
                "<p class = 'card-text'>" + summary + "</p>" + 
                "<button type='button' class='btn articles btn-primary' dbRef = '" + id + "' " + ">Save Article</button>" +
                "</div>" +
                "</div>"
            );
        };

    });
});

// showing existing articles from the database
$("#articles").on("click", function(){
$.get("all", function(data){
   //loop through artciles and add one by one to the DOM
   for(var i = 0; i<data.length; i++){
    console.log(data[i]);

    // create Bootstrap card to holds data for each news article scrapped. 

    var title = data[i].title;
    var link = data[i].link;
    var summary = data[i].summary;
    var id = data[i]._id;
    
    //empty news div first and then append each database article
    //$(".news").empty();
    $(".news").prepend(
        "<div class = 'card'>"
        + "<div class = 'card-body'>"
        + "<a href='" + link + "'><h3 class = 'card-title'>" + title + "</h3></a>" + 
        "<p class = 'card-text'>" + summary + "</p>" + 
        "<button type='button' class='btn articles btn-primary' dbRef = '" + id + "' " + ">Save Article</button>" +
        "</div>" +
        "</div>"
    );
};
});
});

// save articles
// saving articles related to a button clicked. 

$(document).on("click", ".articles", function(){
    var id = $(this).attr("dbRef");
    $.get("/articles/" + id, function(dbArticle){
        console.log(dbArticle);
    });
// remove the the article from the DOM after it is saved. 
// 1st replace all button parent with a simple text

var thisParent = $(this).parent().parent();
thisParent.empty();
thisParent.text("Article saved!");

// remove this div from the dom after 3 seconds
setTimeout(function(){
    thisParent.remove();
}, 3000);
});

// getting saved articles
$("#saved-articles").on("click", function(){
    $.get("/saved", function(data){
       //loop through artciles and add one by one to the DOM
       for(var i = 0; i<data.length; i++){
        console.log(data[i]);
    
        // create Bootstrap card to holds data for each news article scrapped. 
    
        var title = data[i].title;
        var link = data[i].link;
        var summary = data[i].summary;
        var id = data[i]._id;
        
        //empty news div first and then append each database article
        //$(".news").empty();
        $(".saved").prepend(
            "<div class = 'card'>"
            + "<div class = 'card-body'>"
            + "<a href='" + link + "'><h3 class = 'card-title'>" + title + "</h3></a>" + 
            "<p class = 'card-text'>" + summary + "</p>" + 
            "<button type='button' class='btn saved-articles btn-primary' dbRef = '" + id + "' " + ">Add Note</button>" +
            "</div>" +
            "</div>"
        );
    };
    });
    });




});