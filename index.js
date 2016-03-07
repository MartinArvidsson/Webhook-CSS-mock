"use strict"

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.set('view engine', 'ejs');


const bodyParser = require('body-parser');
const releaseCreated = "published";
const issueCreated = "opened";
const issueClosed = "closed";
const issueComment = "created";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/Public'));

app.get('/', function(req, res){
  
  let releases = [];
  let issues = [];
  let issueComments = [];
  
  //HÄMTA FRÅN DATABAS
  
  let toSendToClient = {};
  toSendToClient.releases = releases;
  toSendToClient.issues = issues;
  toSendToClient.issueComment = issueComments;
  
  //ANVÄNDA EJS?
  /*res.render('index', {
    webhooks: toSendToClient
  });*/
  res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res){
  console.log(req.body);
  if(req.body.action == issueComment)
    {
        console.log("Issue COMMENTED");
        let issueCommentObject = {};
        
        issueCommentObject.action = issueComment;
        issueCommentObject.issue_title = req.body.issue.title;              //Title of issue
        issueCommentObject.issue_owner = req.body.issue.user.login;         //Owner of issue
        issueCommentObject.issue_status = req.body.issue.state;             //State of issue
        issueCommentObject.issue_milestone = req.body.issue.milestone;      //No milestone = 0 null
        issueCommentObject.issue_totalComments = req.body.issue.comments;   //Total comments
        issueCommentObject.issue_commentBody = req.body.comment.body;       //The actual comments value
        issueCommentObject.issue_commenter = req.body.sender.login;         //Who did the comment.
        issueCommentObject.organization = req.body.organization.login;      //Organization
        
        io.emit('issue commented', issueCommentObject);
        console.log(issueCommentObject);
        
    }
    else if(req.body.action == issueCreated || req.body.action == issueClosed)
    {
        console.log("Issue CREATED");
        let issueCreatedObject = {};
        
        issueCreatedObject.action = issueCreated;
        issueCreatedObject.issue_title = req.body.issue.title;              //Title of issue
        issueCreatedObject.issue_owner = req.body.issue.user.login;         //Owner of issue
        issueCreatedObject.issue_status = req.body.issue.state;             //State of issue
        issueCreatedObject.issue_milestone = req.body.issue.milestone;      //No milestone = 0 null
        issueCreatedObject.issue_body = req.body.issue.body;                //Body of issue (Description)
        issueCreatedObject.issue_url = req.body.issue.html_url;             //URL to issue
        issueCreatedObject.repo_url = req.body.repository.html_url;         // URL to repository
        issueCreatedObject.issue_creator = req.body.sender.login;           // Who created issue
        issueCreatedObject.organization = req.body.organization.login;      //Organization
        
        io.emit('issue created', issueCreatedObject);
        
        console.log(issueCreatedObject);
        
    }
    else if (req.body.action == releaseCreated)
    {
        console.log("Release CREATED");
        let releaseObject = {};
        
        releaseObject.action = releaseCreated;
        releaseObject.release_url = req.body.release.html_url;              //URL to release on github
        releaseObject.release_name = req.body.release.name;                 // Name of release
        releaseObject.release_tagName = req.body.release.tag_name;          //Tag of release
        releaseObject.release_author = req.body.release.author.login;       // Who waws the author
        releaseObject.release_body = req.body.release.body;                 // Description of release (ish)
        releaseObject.release_tarDownload = req.body.release.tarball_url;   //Download for tar.gz
        releaseObject.release_zipDownload = req.body.release.zipball_url;   // Download of .zip
        releaseObject.release_creator = req.body.sender.login;              // Who did the release that caused a webhook response.
        releaseObject.organization = req.body.organization.login;           //Organization
        io.emit('release created', releaseObject);
        
        console.log(releaseObject);
    }
    else
    {
        //Exception throw
    }
});

// io.on('connection', function(socket){

//});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:' + process.env.PORT || 3000);
});