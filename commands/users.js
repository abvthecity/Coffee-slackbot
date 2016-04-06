// USERS command

// hears: 'users','show users'
var command = function(bot, message){
	bot.reply(message, "If there were users I would show them to you.");
}

module.exports.command = command;