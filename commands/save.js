// SAVE command

// hears: 'save (.*)', 'save (.*) to (.*)'
var command = function(bot, message){
	var link = message.match[1];
	var collection = message.match[2] || "";
	
	if(collection == "") bot.reply(message, 'Thanks! Saved <' + link + '>. Would you like to add it to a collection?');
	else bot.reply(message, 'Thanks! Saved ' + link + ' to *' + collection + '*!');
}

module.exports.command = command;