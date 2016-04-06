// GET READING LIST command

// hears: 'get (.*)','show (.*)', 'list (.*)', 'reading list (.*)'
var command = function(bot, message){
	bot.reply(message, "Sorry, nothing to get.");
}

module.exports = command;