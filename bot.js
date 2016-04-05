if(!process.env.token) {
	console.log('Error: Specify token in environment');
	process.exit(1);
}

var Bot = require('botkit');

var controller = Botkit.slackbot();

var bot = controller.spawn({
	token: process.env.token // need to implement later
}).startRTM(function(err,bot,payload){
	if(err) throw new Error('Could not connect to Slack');
});

// SAVE command
controller.hears(['save (.*)', 'save (.*) to (.*)'], 'direct_message,direct_mention,mention', function(bot, message){
	var link = message.match[1];
	var collection = message.match[2] || "";
	
	if(collection == "") bot.reply(message, 'Thanks! Saved <' + link + '>. Would you like to add it to a collection?');
	else bot.reply(message, 'Thanks! Saved <' + link + '> to *' + collection + '*!');
});

// USERS command
controller.hears(['users','show users'], 'direct_message,direct_mention,mention', function(bot, message){
	bot.reply(message, "If there were users I would show them to you.");
});

// COLLECTIONS command
controller.hears(['collections', 'show collections'], 'direct_message,direct_mention,mention', function(bot, message){
	bot.reply(message, "If there were collections already I would show them to you.");
});

// GET command
controller.hears(['get (.*)','show (.*)', 'list (.*)', 'reading list (.*)'], 'direct_message,direct_mention,mention', function(bot, message){
	bot.reply(message, "Sorry, nothing to get.");
});