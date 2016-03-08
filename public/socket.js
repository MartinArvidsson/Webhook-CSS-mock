"use strict"
let app = {};
app.search = {};

app.init = function(){
    let currentIssue = '' ;
    this.socket = io();
    this.socket.on('release created', function(release){
        
        let releaseAvatar ="<a href='"+ release.release_creator_github_url + "' target='_blank'><img src='" + release.release_creator_avatar + "' alt='Commenter Avatar' class='circle gavatar'></a>";
        let organizationAvatar ="<a href='" + release.organization_github_url + "' target='_blank'><img src='" + release.organization_avatar + "' alt='Organization Avatar' class='circle gavatar'>";
        
        let organization = "<p> Organization: " + release.organization + "</p>";
        let releaseCreator = "<p> Owner: " + release.release_author + " </p>";
        let releaseTagname = "<p>Releasename: " + release.release_name + "</p>";
        let releaseBody = "<p>Description: " + release.release_body + "</p>";
        let releaseLink = "<p><a href ='" + release.release_url + "'>Release Link</a></p>";
        let releaseDownloadLink = "<p><a href='"+ release.release_zipDownload + "'>Download Link</a></p>";
        
        $('#releases tbody').prepend("<tr data-username='" + release.release_author + "' class='maxheight'><td>" + releaseAvatar + releaseCreator + releaseTagname + releaseBody + releaseLink + releaseDownloadLink + organization + organizationAvatar);
        

    });
    
    this.socket.on('issue commented', function(issueComment){
        
        let issueAvatar ="<a href='"+ issueComment.issue_commenter_github_url + "' target='_blank'><img src='" + issueComment.issue_commenter_avatar + "' alt='Commenter Avatar' class='circle gavatar'></a>";
        let organizationAvatar ="<a href='" + issueComment.organization_github_url + "' target='_blank'><img src='" + issueComment.organization_avatar + "' alt='Organization Avatar' class='circle gavatar'>";
        
        let organization = "<p> Organization: " + issueComment.organization + "</p>";
        //let issueOwner = "<p>Owner: " + issueComment.issue_owner + " </p>";
        let issueTitle = "<p>Issue: " + issueComment.issue_title + "</p>";
        let issueCommenter = "<p>Commenter: " + issueComment.issue_commenter + "</p>";
        let issueCommentbody = "<p>Comment: " + issueComment.issue_commentBody + "</p>";
        let issueStatus = "<p>Issue status: " + issueComment.issue_status + "</p>";
        let totalComments = "<p>Total comments: " + issueComment.issue_totalComments + "</p>";
        
        
        $('#issueComments tbody').prepend("<tr data-title='" + issueComment.issue_title + "' class='maxheight' ><td>" + issueAvatar + issueCommenter +  issueTitle+
        issueCommentbody + issueStatus + totalComments +organization + organizationAvatar);
        //console.log(issueComment);
        
        $('#issueComments tbody tr').each(function(index){
            let title = $(this).attr('data-title');
            console.log(title);
            console.log(currentIssue);
            if(title == currentIssue){
                console.log("Jag visas");
                $(this).show();
            }
            else{
                console.log("Jag göms");
                console.log(this);
                $(this).hide();
            }
        });
    });
    
    this.socket.on('issue created', function(issueCreate){
        
        let issueAvatar ="<a href='"+ issueCreate.issue_creator_github_url + "' target='_blank'><img src='" + issueCreate.issue_creator_avatar + "' alt='Commenter Avatar' class='circle gavatar'></a>";
        let organizationAvatar ="<a href='" + issueCreate.organization_github_url + "' target='_blank'><img src='" + issueCreate.organization_avatar + "' alt='Organization Avatar' class='circle gavatar'>";
        let issueCreator = "<p>Owner: " + issueCreate.issue_owner +"</p>";
        let issueTitle = "<p>Issue: " + issueCreate.issue_title + "</p>";
        let issueStatus = "<p>Issue status: " + issueCreate.issue_status + "</p>";
        let issueDescription = "<p> Description: " + issueCreate.issue_body + "</p>";
        let organization = "<p> Organization: " + issueCreate.organization + "</p>";
        //let issueMilestone = "<p>Milestones: " + issueCreate.issue_milestone + "</p>";
        let issueLink = "<p><a href='"+ issueCreate.issue_url + "'>Issue direct link </a></p>";
        
        
        
        let newIssue = "<tr data-title='"+ issueCreate.issue_title +"' data-username='" + issueCreate.issue_owner + "' class='maxheight'><td>"
        +issueAvatar+ issueCreator + issueTitle + issueDescription + issueStatus  + issueLink + organization + organizationAvatar;
        
        $('#issueCreates tbody').prepend(newIssue);
        
        $('#issueCreates tbody tr').each(function(index){
            let title = $(this).attr('data-title');
            if(title == issueCreate.issue_title){
                $(this).on("click",function(){
                let that = this;
                let issueTitle = $(this).attr('data-title');
                    if(currentIssue == issueTitle){
                        currentIssue = '';
                    }
                    else{
                        currentIssue = issueTitle;
                    }
                    $('#issueComments tbody tr').each(function(index){
                        let comment_title = $(this).attr('data-title');
                        
                        if(comment_title == currentIssue){
                            $(this).show();
                            $(that).css({
                                'background-color':'#F2F2F2'
                            });
                        }
                        else{
                            $(this).hide();
                            $(that).css({
                                'background-color':'#727272'
                            });
                        }
                    });
                });
            }
        });
    });
    app.search.initSearch();
};

app.search.initSearch = function(){
    $('#userNameDropDown').keyup(function(){
        let input = this.value.trim();
        console.log(this.value.trim());
        if(input == ""){
            app.search.showAll();
        }
        else{
            app.search.show(input);
        }
        $(this).val(input);
    });
    $('select').material_select();
    
};

app.search.show = function(username){
    username = username.toLowerCase();
    app.search.showRelease(username);
    app.search.showIssue(username);
    //app.search.showIssueComment(username);
};

app.search.showRelease = function(username){
    $('#releases tbody tr').each(function(index){
        let classList = $(this).attr('data-username').split(/\s+/);
        let exists = false;
        $.each(classList, function(index, item) {
            item = item.toLowerCase();
            if(item.indexOf(username) != -1){
                exists = true;
            }
        });
        if(exists){
            $(this).show();
        }
        else{
            $(this).hide();
        }
        /*
        if(!$(this).hasClass(username) && !$(this).hasClass('title')){
            $(this).hide();
        }
        else{
            $(this).show();
        }
        */
    });
};

app.search.showIssue = function(username){
    $('#issueCreates tbody tr').each(function(index){
        let classList = $(this).attr('data-username').split(/\s+/);
        let exists = false;
        $.each(classList, function(index, item) {
            item = item.toLowerCase();
            if(item.indexOf(username) != -1){
                exists = true;
            }
        });
        if(exists){
            $(this).show();
        }
        else{
            $(this).hide();
        }
    });
};

app.search.showIssueComment = function(username){
    $('#issueComments tbody tbody tr').each(function(index){
        let classList = $(this).attr('data-username').split(/\s+/);
        let exists = false;
        $.each(classList, function(index, item) {
            item = item.toLowerCase();
            if(item.indexOf(username) != -1){
                exists = true;
            }
        });
        console.log(exists);
        if(exists){
            $(this).show();
        }
        else{
            $(this).hide();
        }
        /*
        if(!$(this).hasClass(username) && !$(this).hasClass('title')){
            $(this).hide();
        }
        else{
            $(this).show();
        }
        */
    });
};

app.search.showAll = function(){
    // $('#issueComments tbody tr').each(function(index){
    //     $(this).show();
    // });
    
    $('#issueCreates tbody tr').each(function(index){
        $(this).show();
    });
    
    $('#releases tbody tr').each(function(index){
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