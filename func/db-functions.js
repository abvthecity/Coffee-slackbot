var Firebase = require("firebase");
var db = new Firebase("https://readcoffee.firebaseio.com/slackbot");

var slackAPI = require("../func/slack-web-api");

var addLinkToUser = function(bot, link, title, user, collection){

	bot.identifyBot(function(err,identity) {
		var db_team = db.child(identity.team_id);
		var objSet = {
			url: link,
			title: title,
			user: user,
			collection: collection
		};

		var db_newURL = db_team.child("urls").push();
		db_newURL.set(objSet);

		// push link to users database
		db.child(identity.team_id).child("users").child(user).child("urls").child(db_newURL.key()).set(objSet);

		// re-insert name if doesn't exist
		slackAPI(bot, "users.info", {user:user}, function(data){
			var userName = data.user.name;
			db.child(identity.team_id).child("users").child(user).once("value", function(snapshot){
				if(snapshot.val().name != userName)
					db.child(identity.team_id).child("users").child(user).child("name").set(userName);
			});
		})

		// push link to collections database
		db.child(identity.team_id).child("collections").child(collection).child("urls").child(db_newURL.key()).set(objSet);
	});
}

var removeLink = function(bot, user, collection, hashID){
	bot.identifyBot(function(err,identify){
		var db_team = db.child(identify.team_id);
		db_team.child("urls").child(hashID).remove();
		db_team.child("users").child(user).child("urls").child(hashID).remove();
		db_team.child("collections").child(collection).child("urls").child(hashID).remove();
	});
}

module.exports.addLinkToUser = addLinkToUser;
module.exports.removeLink = removeLink;