//require('dotenv').config();

var Botkit = require('botkit');
var BeepBoop = require('beepboop-botkit')

var Firebase = require("firebase");
var db = new Firebase("https://readcoffee.firebaseio.com/slackbot");

var controller = Botkit.slackbot()
var beepboop = BeepBoop.start(controller, { debug: true })

// listen for botkit controller events
controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, 'I\'m here!')
})


// Handle events related to the websocket connection to Slack
controller.on('rtm_open',function(bot) {
  console.log('** The RTM api just connected!');
});

controller.on('rtm_close',function(bot) {
  console.log('** The RTM api just closed');
  // you may want to attempt to re-open
});

// IMPORT COMMANDS
var command = require("./commands/commands");

// SAVE command
controller.hears(['save http(.*)', 'add http(.*)', 'collect http(.*)', 'http(.*)'], 'direct_message,direct_mention,mention,ambient', command.save);

// USERS command
controller.hears(['users'], 'direct_message,direct_mention,mention', command.users);

// COLLECTIONS command
controller.hears(['collections', 'categories', 'topics'], 'direct_message,direct_mention,mention', command.collections);

// READINGLIST command
controller.hears(['get (.*)','show (.*)', 'list (.*)', 'reading list (.*)'], 'direct_message,direct_mention,mention', command.readinglist);

// HELLO command
controller.hears(['hello','hi','hey','help'],'direct_message,direct_mention,mention', command.hello);

// RANDOM command
controller.hears(['random'],'direct_message,direct_mention,mention', command.random);

// REMOVE command
controller.hears(['remove (.*)', 'remove'],'direct_message,direct_mention,mention', command.remove);
