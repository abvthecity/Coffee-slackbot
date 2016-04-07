// HELLO command

var Firebase = require("firebase");
var db = new Firebase("https://readcoffee.firebaseio.com/slackbot");

var slackAPI = require("../func/slack-web-api");

// hears: 'hello','hi','hey','help'
var command = function(bot,message){

	var sayHelp = function(){
		var helpMessage = "";
		helpMessage += "Coffee is designed to help you and your team to _quietly_ recommend and collaboratively curate lists of great reads. \nHere are some commands to get you started:\n";
		helpMessage += "--- *Just paste any `http://` link that you want to add to the team's collections.*\n";
		helpMessage += "--- Type `save http://your.article/permalink to #inspiring` to add the link to the #inspiring collection.\n";
		helpMessage += "--- `users` will return a list of active users.\n";
		helpMessage += "--- `collections` will return a list of collections.\n";
		helpMessage += "--- `get #collection-name` or `get @username` will return list of articles posted in the collection or by the user.\n";
		helpMessage += "Happy reading! :)";
		bot.reply(message, helpMessage);
	}

	if(message.text.indexOf("help") > -1){ 
		bot.reply(message, "Hey there. I'm here to help!");
		sayHelp();
	}
	else {
		slackAPI("users.info", {user:message.user}, function(data){
			var userName = data.user.name;
			bot.reply(message, "Hello @" + userName + "!");
			bot.identifyBot(function(err,identity) {
				db.child(identity.team_id).child("users").child(message.user).once("value", function(snapshot){
					if(!snapshot.exists()){
						db.child(identity.team_id).child("users").child(message.user).child("name").set(userName);
						bot.reply(message, "Seems like you're new to coffee!");
						sayHelp();
					}
				});
			});
		})
	}
}

module.exports = command;