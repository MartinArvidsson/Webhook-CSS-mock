"use strict"
let app = {};
app.search = {};

app.init = function(){
    this.socket = io();
    this.socket.on('release created', function(release){
        
        let releaseCreator = "<p>Username: " + release.release_author + " </p>";
        let releaseTagname = "<p>Title: " + release.release_name + "</p>";
        let releaseLink = "<p><a href ='" + release.release_url + "'>Release Link</a></p>";
        let releaseDownloadLink = "<p><a href='"+ release.release_zipDownload + "'>Download Link</a></p>";
        
        $('#releases tbody').prepend("<tr class='" + release.release_author + "'><td>" + releaseCreator + releaseTagname + releaseLink + releaseDownloadLink);
        
        console.log(release);
        app.search.add(release.release_author);
        
        app.search.update();
    });
    
    this.socket.on('issue commented', function(issueComment){
        
        let issueOwner = "<p>Owner: " + issueComment.issue_owner + " </p>";
        let issueTitle = "<p>Issue: " + issueComment.issue_title + "</p>";
        let issueCommenter = "<p>Commentor: " + issueComment.issue_commenter + "</p>";
        let issueCommentbody = "<p>Comment: " + issueComment.issue_commentBody + "</p>";
        let issueStatus = "<p>Status: " + issueComment.issue_status + "</p>";
        
        $('#issueComments tbody').prepend("<tr class='" + issueComment.issue_title + "'><td>" + issueOwner + issueTitle + issueCommenter + issueCommentbody + issueStatus);
        //console.log(issueComment);
        
        $('#issueComments tr').each(function(index){
            if(!$(this).hasClass('title') && $(this).hasClass(issueComment.issue_title)){
                $(this).hide();
            }
        });
        app.search.add(issueComment.issue_commenter);
        
        app.search.update();
    });
    
    this.socket.on('issue created', function(issueCreate){
        
        let issueCreator = "<p>Username: " + issueCreate.issue_owner + " </p>";
        let issueTitle = "<p>Title: " + issueCreate.issue_title + "</p>";
        let issueStatus = "<p>Status: " + issueCreate.issue_status + "</p>";
        let issueMilestone = "<p>Milestones: " + issueCreate.issue_milestone + "</p>";
        let issueLink = "<p><a href='"+ issueCreate.issue_url + "'>Issue direct link </a></p>";
        let newIssue = "<tr class='" + issueCreate.issue_owner +"' id='" + issueCreate.issue_title + "' ><td>"
        + issueCreator + issueTitle + issueStatus + issueMilestone + issueLink;
        
        $('#issueCreates tbody').prepend(newIssue);
        
        $('#issueCreates tr').each(function(index){
            if(!$(this).hasClass('title') && $(this).hasClass(issueCreate.issue_owner)){
                $(this).on("click",function(){
                   $('#issueComments tr').each(function(index){
                    if(!$(this).hasClass('title') && $(this).hasClass(issueCreate.issue_title)){
                        if($(this).is( ":visible" ))
                        {
                            $(this).hide();
                        }
                        else
                        {
                            $(this).show();
                        }
                        }
                    });
                });
            }
        });
        
        console.log(issueCreate);
        app.search.add(issueCreate.issue_owner);
        
        app.search.update();
    });
    app.search.initSearch();
};

app.search.findComments = function()
{
    console.log("ASDF");
};

app.search.initSearch = function(){
    $('#userNameDropDown').change(function(){
        if(this.value == "0"){
            app.search.showAll();
        }
        else{
            app.search.show(this.value);
        }
    });
    $('select').material_select();
};

app.search.show = function(username){
    app.search.showRelease(username);
    app.search.showIssue(username);
    //app.search.showIssueComment(username);
};

app.search.showRelease = function(username){
    $('#releases tr').each(function(index){
        if(!$(this).hasClass(username) && !$(this).hasClass('title')){
            $(this).hide();
        }
        else{
            $(this).show();
        }
    });
};

app.search.showIssue = function(username){
    $('#issueCreates tr').each(function(index){
        if(!$(this).hasClass(username) && !$(this).hasClass('title')){
            $(this).hide();
        }
        else{
            $(this).show();
        }
    });
};

// app.search.showIssueComment = function(username){
// };

app.search.showAll = function(){
    // $('#issueComments tr').each(function(index){
    //     $(this).show();
    // });
    
    $('#issueCreates tr').each(function(index){
        $(this).show();
    });
    
    $('#releases tr').each(function(index){
        $(this).show();
    });
    
};

app.search.add = function(userName){
    console.log(userName);
    let exists = false;
    $('#userNameDropDown option').each(function(index){
        console.log(this.value);
        if(this.value == userName){
            exists = true;
        }
    });
    
    if(exists == false){
        $('#userNameDropDown').append('<option value="' + userName + '">' + userName + '</option>');
    }
    $('select').material_select()
};

app.search.update = function(){
    let option = $('#userNameDropDown').val();
    console.log(option);
    if(option == 0){
        app.search.showAll();
    }
    else{
        app.search.showRelease(option);
        app.search.showIssue(option);
        app.search.showIssueComment(option);
    }
    
};

window.onload = app.init();