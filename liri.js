var keys = require('./keys.js');

var Twitter = require('twitter');

var Spotify = require('node-spotify-api');

var request = require('request');

var fs = require("fs");


var command = process.argv[2];

var commandParameter = process.argv[3];

if(command === 'my-tweets'){
	showMyTweets();
}

if(command === 'spotify-this-song'){
	spotifySong(commandParameter);
}

if(command === 'movie-this'){
	movieThis(commandParameter);
}

if(command === 'do-what-it-says'){
	randomCommand();
}

function showMyTweets () {
var client = new Twitter(keys.twitterKeys);

var params = {screen_name: 'MaryMorganChas'};

client.get('statuses/user_timeline', params, function(error, tweets, response) {

	if (!error) {
	    for(var i = 0; i < Math.min(tweets.length, 20); i++){
			var tweet = tweets[i];

			console.log(tweet.text);
			console.log("Created on: " + tweet.created_at);
			console.log("-----------------------------");
		}
	} else {
		console.log(error);
	}
	});
}

function spotifySong (commandParameter = 'The Sign') {

//var client = new Spotify(keys.spotifyKeys);
 
var spotify = new Spotify(keys.spotifyKeys);
 
spotify.search({ type: 'track', query: commandParameter }, function(err, data) {
		  if (err) {
		    return console.log('Error occurred: ' + err);
		  }

 		//console.log(data);
 		for(var i = 0; i < data.tracks.items.length; i++){
 			var item = data.tracks.items[i];
 			console.log("Song name: " + item.name);

 			console.log("Album name: " + item.album.name);

 			console.log("Preview Url: " + item.preview_url);

 			var artistsNames = [];
 			for(var j = 0; j < item.artists.length; j++) {
 				var artistsName = item.artists[j].name;
 				artistsNames[j] = artistsName;
 			}

 			console.log("Artists Name: " + artistsNames);
 			console.log("--------------------------")
 			
 		}
	});
}


function movieThis(commandParameter = 'Mr. Nobody') {

	request("http://www.omdbapi.com/?t="+commandParameter+"&y=&plot=short&apikey=40e9cece", function(error, response, body) {
			body = JSON.parse(body);
			//console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
 			console.log("Movie Title: " + body.Title);
 			console.log("Year movie came out: " + body.Year);
 			if(body.Ratings) {
	 			for (var i = 0; i < Math.min(body.Ratings.length, 2); i++) {
	 				console.log("Movie ratings: " + body.Ratings[i].Source + " gave " + body.Ratings[i].Value)
	 			}
 			}
 			console.log("The country the movie was filmed in: " + body.Country);
 			console.log("Plot of the movie: " + body.Plot);
 			console.log("Actors in the movie: " + body.Actors);
 			console.log("--------------------------");
	});
	
}
function randomCommand() {
	var lineReader = require('readline').createInterface({
	  input: require('fs').createReadStream('random.txt')
	});

	lineReader.on('line', function (line) {
		var tokens = line.split(",");
		var command = tokens[0];
		var commandParameter = tokens[1];
		
		if(command === 'my-tweets'){
			showMyTweets();
		}

		if(command === 'spotify-this-song'){
			spotifySong(commandParameter);
		}

		if(command === 'movie-this'){
			movieThis(commandParameter);
		}

		if(command === 'do-what-it-says'){
			//ignore to avoid loop
		}
	});

}
