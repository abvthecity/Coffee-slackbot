// RANDOM command

var Firebase = require("firebase");
var db = new Firebase("https://readcoffee.firebaseio.com/slackbot");

var slackAPI = require("../func/slack-web-api");

var command = function(bot, message){
	bot.identifyBot(function(err,identity) {
	slackAPI("users.list", {}, function(data){
		db.child(identity.team_id).child("urls").once("value", function(urldata){
			var colString = "";
			var colCount = 0;
			var rand = Math.floor(Math.random() * urldata.numChildren());
			urldata.forEach(function(url){
				if(colCount == rand){
					var userName = url.val().user;
					colString = "*" + url.val().title + "* recommended by <@"+userName+"> in #"+url.val().collection+" : " + url.val().url;
				}
				colCount++;
			});

			bot.reply(message, colString);
		});
	});
});
}

module.exports = command;