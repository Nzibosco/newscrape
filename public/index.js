$(document).ready(function(){

//get articles when scrape button is clicked

$("#scrape").on("click", function(){
    //tell the database to scraoe articles first
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
            
            //empty news div first and then append each database article
            $(".news").empty();
            $(".news").append(
                "<div class = 'card'>"
                + "<div class = 'card-body'>"
                + "<a href='" + link + "'><h3 class = 'card-title'>" + title + "</h3></a>" + 
                "<p class = 'card-text'>" + summary + "</p>" + 
                "<a href='' class='btn btn-primary'>Save Article</a>" +
                "</div>" +
                "</div>"
            );






    //         <!-- <div class="card">
    //         <div class="card-body">
    //           <h5 class="card-title">Card title</h5>
    //           <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    //           <a href="#" class="btn btn-primary">Go somewhere</a>
    //         </div>
    //  </div> -->
        };

    });
});




});