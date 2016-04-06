// COLLECTIONS command

var Firebase = require("firebase");
var db = new Firebase("https://readcoffee.firebaseio.com/slackbot");

// hears: 'collections', 'show collections', 'show my collections'
var command = function(bot, message){

	bot.identifyBot(function(err,identity) {
		db.child(identity.team_id).child("collections").once("value", function(snapshot){
			var colString = "";
			var colCount = 0;

			snapshot.forEach(function(data){
				colCount++;
				colString += "\n* *#" + data.key() + "* (" + Object.keys(data.val().urls).length + ")";
			});

			if(colCount > 0){
				bot.reply(message, 'There are '+ colCount +' existing collections:'+ colString);
				bot.reply(message, 'Type "get #collection-name" to retrieve a list of articles of that collection.');
			}
			else bot.reply(message, "If there were collections I would show them to you.");
		});
	});
}

module.exports = command;