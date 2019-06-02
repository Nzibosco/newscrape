$(document).ready(function () {

    // reload the application with the logo is clicked
    $(".navbar-brand").on("click", function () {
        location.reload();
    });
    //get articles when scrape button is clicked

    $("#scrape").on("click", function () {
        //tell the database to scrape articles first
        $.get("/scrape", function (response) {
            console.log("scrape command sent!");
        })
            .then(function (scrapeDone) {
                console.log(scrapeDone);
                //proceed with getting all articles from the database
                $.get("/all", function (data) {

                    //empty news div first and then append each database article
                    $(".news").empty();

                    //loop through artciles and add one by one to the DOM
                    for (var i = 0; i < data.length; i++) {
                        console.log(data[i]);

                        // create Bootstrap card to holds data for each news article scrapped. 

                        var title = data[i].title;
                        var link = data[i].link;
                        var summary = data[i].summary;
                        var id = data[i]._id;

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
    });

    // showing existing articles from the database
    $("#articles").on("click", function () {
        $.get("all", function (data) {
            //empty news div first and then append each database article
            $(".news").empty();
            // then loop through artciles and add one by one to the DOM
            for (var i = 0; i < data.length; i++) {
                console.log(data[i]);

                // create Bootstrap card to holds data for each news article scrapped. 

                var title = data[i].title;
                var link = data[i].link;
                var summary = data[i].summary;
                var id = data[i]._id;

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

    $(document).on("click", ".articles", function () {
        var id = $(this).attr("dbRef");
        $.get("/articles/" + id, function (dbArticle) {
            console.log(dbArticle);
        });
        // remove the article from the DOM after it is saved. 
        // 1st replace all button parent with a simple text

        var thisParent = $(this).parent().parent();
        thisParent.empty();
        thisParent.text("Article saved!");

        // remove this div from the dom after 3 seconds
        setTimeout(function () {
            thisParent.remove();
        }, 3000);
    });

    // getting saved articles
    $("#saved-articles").on("click", function () {
        $.get("/saved", function (data) {

            //empty saved div first
            $(".news").empty();
            //loop through artciles and add one by one to the DOM
            for (var i = 0; i < data.length; i++) {
                console.log(data[i]);

                // create Bootstrap card to holds data for each news article scrapped. 

                var title = data[i].title;
                var link = data[i].link;
                var summary = data[i].summary;
                var id = data[i]._id;

                $(".news").prepend(
                    "<div class = 'card'>"
                    + "<div class = 'card-body'>"
                    + "<a href='" + link + "'><h3 class = 'card-title'>" + title + "</h3></a>" +
                    "<p class = 'card-text'>" + summary + "</p>" +
                    // a button to trigger the modal to add or read articles. 
                    "<button type='button' id = 'addNotes' class='btn btn-primary' data-toggle='modal' data-target='#modalNotes' dbRef = '" + id + "' " + ">Add / see notes</button>" +
                    "</div>" +
                    "</div>"

                );
            };
        });
    });


    // When you click the savenote button, get id associated to the article
    // 1st. declar var dataId to hold the id of the selected article.
    var dataId;

    $(document).on("click", "#addNotes", function () {
        // Grab the id associated with the article from the submit button
        dataId = $(this).attr("dbRef");
        console.log(dataId);
        // make an ajax call to get notes associated to the article clicked so we can be able to update th note if we want to. 
        $.get("/artNote/" + dataId, function (data) {
            console.log(data);
            // if there is note associated to the article, populate the modal with note's text
            if (data.note) {
                    $("#noteTitle").val(data.note.title);
                    $("#noteBody").val(data.note.body);
            };
            // empty the modal on exit. This will help avoid populating articles with no notes from
            // being populated by notes from previous notes, as they are posted in the DOM according code above. 
            $(".close, #close").on("click", function () {
                $("#noteTitle").val("");
                $("#noteBody").val("");
            });
        });
    });
    // Now run a POST request when the savenote button through the modal is clicked
    $("#saveNote").on("click", function () {
        $.ajax({
            method: "POST",
            url: "/save/" + dataId,
            data: {
                // Value taken from title input
                title: $("#noteTitle").val(),
                // Value taken from note textarea
                body: $("#noteBody").val()
            }
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // Also, remove the values entered in the input and textarea for note entry
                $("#noteTitle").val("");
                $("#noteBody").val("");
            });

    });


});