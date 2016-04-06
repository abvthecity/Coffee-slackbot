// SAVE command

var ArticleParser = require("article-parser");


var Firebase = require("firebase");
var db = new Firebase("https://readcoffee.firebaseio.com/slackbot");

// hears: 'save http(.*)', 'add http(.*)', 'collect http(.*)', 'http(.*)'
var command = function(bot, message){
	var splitted = message.match[1].split("to ");
	var link = "http" + splitted[0].replace('<','').replace('>','');
	var collection = splitted[1] || "";
	collection = collection.toLowerCase().replace('#','').replace(' ','-');
	console.log(link);

	var addLinkToUser = function(collection){

		bot.identifyBot(function(err,identity) {
			// push link to users database
			var db_newUserLink = db.child(identity.team_id).child("users").child(message.user).child("urls").push();
			db_newUserLink.set({
				url: link,
				collection: collection
			});

			// push link to collections database
			var db_newCollectionLink = db.child(identity.team_id).child("collections").child(collection).child("urls").push();
			db_newCollectionLink.set({
				url: link,
				user: message.user
			});
		});
	}
	
	ArticleParser.extract(link).then(function(article){

		if(collection == ""){ // collections wasn't declared
			var conversation = function(err, convo){
				convo.say('Thanks! Saved "*' + article.title + '*" <' + link + '>.');
				convo.say('Would you like to add it to a collection?');

				bot.identifyBot(function(err,identity) {
					db.child(identity.team_id).child("collections").once("value", function(snapshot){
						var colString = "";
						var colCount = 0;

						snapshot.forEach(function(data){
							colCount++;
							colString += "\n* *#" + data.key() + "* (" + Object.keys(data.val().urls).length + ")";
						});

						convo.say('There are '+ colCount +' existing collections:'+ colString +'\n+ create new collection');
						convo.ask('Type in the name of existing or new collection, or type "no" to add to _uncategorized_.', [
							{
								pattern:'no',
								callback: function(res, convo){
									addLinkToUser("uncategorized");
									convo.say('Alright. Added your link to collection:*_#uncategorized_* instead. ¯\\_(ツ)_/¯');
									convo.next();
								}
							},
							{
								default: true,
								callback: function(res, convo){
									collection = res.text.toLowerCase().replace('#','').replace(' ','-');
									addLinkToUser(collection);
									convo.say('Thanks! Added your link to collection:*_#' + collection + '_*');
									convo.next();
								}
							}

						]);
					});
				});

			}

			bot.startConversation(message,conversation); // initiate conversation
		}
		else { // collections was declared
			addLinkToUser(collection);
			bot.reply(message, 'Thanks! Saved "*' + article.title + '*" <' + link + '> to *_#' + collection + '_*');
		}

	}).catch(function(err){ // couldn't parse article
		if(err) bot.reply(message, 'Sorry, something was wrong with your url <' + link + '> and I wasn\'t able to add it to your collections. Try again?');
	});
}

module.exports = command;