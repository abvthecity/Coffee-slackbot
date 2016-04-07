// SAVE command

var MetaInspector = require('node-metainspector');

var Firebase = require("firebase");
var db = new Firebase("https://readcoffee.firebaseio.com/slackbot");

var dbFunc = require("../func/db-functions");

// hears: 'save http(.*)', 'add http(.*)', 'collect http(.*)', 'http(.*)'
var command = function(bot, message){
	var splitted = message.match[1].split(" to ");
	var link = "http" + splitted[0].replace('<','').replace('>','');
	var collection = splitted[1] || "";
	collection = collection.toLowerCase().replace('#','').replace(' ','-');
	console.log(link);

	var client = new MetaInspector(link, { timeout: 5000 });

	client.on("fetch", function(){

		if(collection == ""){ // collections wasn't declared

			var conversation = function(err, convo){
				var clientTitle = client.title.replace('\n','');
				if(clientTitle == ""){
					convo.ask('I attempted to save <' + link + '>, but I couldn\'t find a title. Could you paste the title for me?', [
						{
							default: true,
							callback: function(res, convo){
								addToCollectionsConversationWrapper(res.text);
								convo.next();
							}
						}
					]);
				} else addToCollectionsConversationWrapper(clientTitle);

				var addToCollectionsConversationWrapper = function(clientTitle){

					// display list of collections, then ask for the name of collection to add to
					var addToCollectionsConversation = function(colCount, colString){
						convo.say('Thanks! Saved "*' + clientTitle + '*" <' + link + '>.\nWould you like to add it to a collection?');
						convo.ask('There are '+ colCount +' existing collections:'+ colString +'\n+ create new collection\nType in the name of existing or new collection, or type "no" to add to _uncategorized_.', [
							{
								pattern:'no',
								callback: function(res, convo){
									dbFunc.addLinkToUser(bot, link, clientTitle, message.user, "uncategorized");
									convo.say('Alright. Added your link to collection:*_#uncategorized_* instead. ¯\\_(ツ)_/¯');
									convo.next();
								}
							},
							{
								default: true,
								callback: function(res, convo){
									collection = res.text.toLowerCase().replace('#','').replace(' ','-');
									dbFunc.addLinkToUser(bot, link, clientTitle, message.user, collection);
									convo.say('Thanks! Added your link to collection:*_#' + collection + '_*');
									convo.next();
								}
							}

						]);
					}

					// pull collections from database
					bot.identifyBot(function(err,identity) {
						db.child(identity.team_id).child("collections").once("value", function(snapshot){
							var colString = "";
							var colCount = 0;

							snapshot.forEach(function(data){
								colCount++;
								colString += "\n--- *#" + data.key() + "* (" + Object.keys(data.val().urls).length + ")";
							});

							addToCollectionsConversation(colCount, colString);
						});
					});

				}

			}

			bot.startConversation(message,conversation); // initiate conversation
		}
		else { // collections was declared
			var clientTitle = client.title.replace('\n','');
			if(clientTitle == ""){
				bot.startConversation(message,function(err, convo){
					convo.ask('I attempted to save <' + link + '>, but I couldn\'t find a title. Could you paste the title for me?', function(res, convo){
						clientTitle = res.text.replace('\n','');
						convo.next();
					});
				});
			}
			dbFunc.addLinkToUser(bot, link, clientTitle, message.user, collection);
			bot.reply(message, 'Thanks! Saved "*' + clientTitle + '*" <' + link + '> to *_#' + collection + '_*');
		}

	});

	client.on("error", function(err){ // couldn't parse article
		if(err) bot.reply(message, 'Sorry, something was wrong with your url <' + link + '> and I wasn\'t able to add it to your collections. Try again?');
	});

	client.fetch();
}

module.exports = command;