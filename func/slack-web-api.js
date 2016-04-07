//require('dotenv').config();

var https = require("https");

module.exports = function(bot, APIRequest, param, callback){
	//param = param || {};
	var url = "https://slack.com/api/" + APIRequest + "?token=" + bot.config.token;
	for(var key in param){
		url += "&" + key + "=" + param[key];
	}
	
	https.get(url, function(res) {
		var body = ''
		res.on('data', function(ch) { body += ch })

		res.on('end', function() {
			try {
				var data = JSON.parse(body)
				console.log(data);
				callback(data) // IMPORTANT
			} catch(e) {
				//console.error("Error: ")
			}
		})
	}).on('error', function(e) {
		console.error("Error: ", e)
	})
}