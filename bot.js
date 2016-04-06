require('dotenv').config();

/*if (!process.env.TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}*/

var Botkit = require('botkit');
var Firebase = require("firebase");
var db = new Firebase("https://readcoffee.firebaseio.com/");

var controller = Botkit.slackbot({
	debug:true
});

var bot = controller.spawn({
	token: process.env.TOKEN
}).startRTM();

// IMPORT COMMANDS
var bot_hello = require('./commands/hello');
var bot_save = require('./commands/save');
var bot_users = require('./commands/users');
var bot_collections = require('./commands/collections');
var bot_readinglist = require('./commands/readinglist');

// HELLO command
controller.hears(['hello','hi','hey','help'],'direct_message,direct_mention,mention', bot_hello.command);

// SAVE command
controller.hears(['save (.*)', 'save (.*) to (.*)'], 'direct_message,direct_mention,mention', bot_save.command);

// USERS command
controller.hears(['users','show users'], 'direct_message,direct_mention,mention', bot_users.command);

// COLLECTIONS command
controller.hears(['collections', 'show collections', 'show my collections'], 'direct_message,direct_mention,mention', bot_collections.command);

// READINGLIST command
controller.hears(['get (.*)','show (.*)', 'list (.*)', 'reading list (.*)'], 'direct_message,direct_mention,mention', bot_readinglist.command);