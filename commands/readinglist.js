// GET READING LIST command

var Firebase = require("firebase");
var db = new Firebase("https://readcoffee.firebaseio.com/slackbot");

var slackAPI = require("../func/slack-web-api");

// hears: 'get (.*)','show (.*)', 'list (.*)', 'reading list (.*)'
var command = function(bot, message){
	var matched = match[1];
	var hashtag = "", at = "", mention = false;
	if(matched.indexOf("#") > -1){
		hashtag = matched.split("#")[1].split(" ")[0];
	}
	if(matched.indexOf("@") > -1){
		at = matched.split("@")[1].split(" ")[0];
		if(at.indexOf(">") > -1) mention = true;
		at = at.replace(">","");
	}

	if(hashtag != "" && at == ""){ // just collections
		bot.identifyBot(function(err,identity) {
			db.child(identity.team_id).child("collections").child(hashtag).child("urls").once("value", function(urldata){
				var colString = "";
				var colCount = 0;

				urldata.forEach(function(url){
					colCount++;
					slackAPI("users.info", {user:url.val().user}, function(data){
						colString += "\n* *" + url.val().title + "* recommended by @"+data.user.name+" : " + url.val().url;
					});
				});

				bot.reply(message, 'There are '+ colCount +' articles in *#' + hashtag + '*:'+ colString);
			});
		});
	}
	
	if(hashtag == "" && at != ""){ // just user

		if(!mention){
			slackAPI("users.list", {}, function(data){
				for(var key in data.members){
					if(data.members[key].name == at){
						at = data.members[key].id;
						break;
					}
				}
			});
		}

		bot.identifyBot(function(err,identity) {
			db.child(identity.team_id).child("users").child(at).child("urls").once("value", function(urldata){
				var colString = "";
				var colCount = 0;

				urldata.forEach(function(url){
					colCount++;
					colString += "\n* *" + url.val().title + "* in #" + url.val().collection + " : " + url.val().url;
				});

				bot.reply(message, 'There are '+ colCount +' articles recommended by *@' + at + '* :'+ colString);
			});
		});
	}
	
	if(hashtag == "" && at == "") {
		bot.reply(message, "Sorry, nothing to get.");
	}
}

module.exports = command;