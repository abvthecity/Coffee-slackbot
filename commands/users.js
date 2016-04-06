// USERS command

var Firebase = require("firebase");
var db = new Firebase("https://readcoffee.firebaseio.com/slackbot");

// hears: 'users','show users'
var command = function(bot, message){
	
	bot.identifyBot(function(err,identity) {
		db.child(identity.team_id).child("users").once("value", function(snapshot){
			var colString = "";
			var colCount = 0;

			snapshot.forEach(function(data){
				colCount++;
				colString += "\n* *@" + data.key() + "* (" + Object.keys(data.val().urls).length + ")";
			});

			if(colCount > 0){
				bot.reply(message, 'There are '+ colCount +' active users:'+ colString);
				bot.reply(message, 'Type "get @username" to retrieve a list of articles that person has collected.');
			}
			else bot.reply(message, "If there were active users I would show them to you.");
		});
	});
}

module.exports = command;