require('dotenv').config();

/*if (!process.env.TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}*/

var Botkit = require('botkit');
var Firebase = require("firebase");
var db = new Firebase("https://readcoffee.firebaseio.com/slackbot");

var controller = Botkit.slackbot({
	debug:true
});

var bot = controller.spawn({
	token: process.env.TOKEN
}).startRTM();

// IMPORT COMMANDS
var command = require("./commands/commands");

// SAVE command
controller.hears(['save http(.*)', 'add http(.*)', 'collect http(.*)', 'http(.*)'], 'direct_message,direct_mention,mention', command.save);

// READINGLIST command
controller.hears(['get (.*)','show (.*)', 'list (.*)', 'reading list (.*)'], 'direct_message,direct_mention,mention', command.readinglist);

// USERS command
controller.hears(['users','show users'], 'direct_message,direct_mention,mention', command.users);

// COLLECTIONS command
controller.hears(['collections', 'show collections', 'show my collections'], 'direct_message,direct_mention,mention', command.collections);

// HELLO command
controller.hears(['hello','hi','hey','help'],'direct_message,direct_mention,mention', command.hello);