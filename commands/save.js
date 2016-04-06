// SAVE command

var ArticleParser = require("article-parser");


var Firebase = require("firebase");
var db = new Firebase("https://readcoffee.firebaseio.com/slackbot");
var db_users = db.child("users");

// hears: 'save (.*)', 'save (.*) to (.*)'
var command = function(bot, message){
	var splitted = message.match[1].split("to ");
	var link = splitted[0].replace('<','').replace('>','');
	var collection = splitted[1] || "";
	console.log(link);
	
	ArticleParser.extract(link).then(function(article){
		if(collection == ""){ // collections wasn't declared
			var conversation = function(err, convo){
				convo.say('Thanks! Saved "*' + article.title + '*" <' + link + '>.');
				convo.ask('Would you like to add it to a collection?', [
					{
						pattern:'no',
						callback: function(res, convo){
							convo.say('Alright. Added your link to collection:*_uncategorized_* instead. ¯\\_(ツ)_/¯');
							convo.next();
						}
					},
					{
						default: true,
						callback: function(res, convo){
							convo.say('Thanks! Added your link to collection:*_' + res.text + '_*');
							convo.next();
						}
					}

				]);
			}
			bot.startConversation(message,conversation);
		}
		else bot.reply(message, 'Thanks! Saved "*' + article.title + '*" <' + link + '> to *_' + collection + '_*'); // collections was declared
	}).catch(function(err){
		bot.reply(message, 'Sorry, something was wrong with your url <' + link + '> and I wasn\'t able to add it to your collections. Try again?');
	});
}

module.exports = command;