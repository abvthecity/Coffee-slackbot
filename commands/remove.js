// REMOVE command

var Firebase = require("firebase");
var db = new Firebase("https://readcoffee.firebaseio.com/slackbot");

var dbFunc = require("../func/db-functions");

// hears: 'remove'
var command = function(bot, message){
	var hashID = message.match[1];
	console.log(hashID);

	bot.identifyBot(function(err,identity) {
		if(!hashID){
			db.child(identity.team_id).child("users").child(message.user).child("urls").once("value", function(urldata){
				var colString = "";
				var colCount = 0;

				urldata.forEach(function(url){
					colCount++;
					colString += "\n--- `"+url.key()+"` | *" + url.val().title + "* in #" + url.val().collection + " : " + url.val().url;
				});

				bot.reply(message, 'You\'ve recommended '+ colCount +' articles:'+ colString +'\n');
				bot.reply(message, 'To remove an article, type `remove ARTICLE_HASH_ID` (indicated next to each article).');
			});
		}
		else {
			db.child(identity.team_id).child("users").child(message.user).child("urls").child(hashID).once("value", function(snapshot){
				if(snapshot.exists()){
					dbFunc.removeLink(bot, message.user, snapshot.val().collection, hashID);
					bot.reply(message, "Ok. I've deleted `"+hashID+"`.");
				} else bot.reply(message, "Sorry, I couldn't delete `"+hashID+"`.");
			});
		}
	});
}

module.exports = command;