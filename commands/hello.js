// HELLO command

// hears: 'hello','hi','hey','help'
var command = function(bot,message){
	bot.reply(message, "Whatsup?");
}

module.exports.command = command;