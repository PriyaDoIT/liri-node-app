//read and set any environment variables with the dotenv package:
require("dotenv").config();

/* required packages and links */
var keys = require("./keys.js");

var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");

//access keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

/* commands */
var commands = process.argv[2];
var userInput = process.argv[3];

switch (commands) {
    case "my-tweets":
        tweets();
        break;

    case "spotify-this-song":
        spotifySong();
        break;

    case "movie-this":
        movie();
        break;

    case "do-what-it-says":
        dowhat();
        break;

}


//if my-tweets command is called...
function tweets() {
    var params = { screen_name: 'pshah824', count: 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log("=============================================");
            console.log("Here are the most recent tweets");
            for (var i = 0; i < tweets.length; i++) {
                console.log("_____________________________________________");
                console.log("Tweeted on: " + tweets[i].created_at);
                console.log(tweets[i].text);
            }
        }
    });
}

// if spotify-this-song is called...
function spotifySong() {
    if (userInput == null) {
        userInput = 'I Saw the Sign';
    }
        
    spotify.search({ type: 'track', query: userInput, limit: 1 }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Preview Link: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
    });
}


// if movie-this is called...
function movie() {
    //if undefined, default to Mr. Nobody
    if (userInput == undefined) {
        userInput = 'Mr. Nobody';
    }
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {

            console.log("Title of the Movie: " + JSON.parse(body).Title);
            console.log("Year the movie came out: " + JSON.parse(body).Year);
            console.log("IMDB Rating of the movie: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating of the movie: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country where the movie was produced: " + JSON.parse(body).Country);
            console.log("Language of the Movie: " + JSON.parse(body).Language);
            console.log("Plot of the Movie: " + JSON.parse(body).Plot);
            console.log("Actors of the Movie: " + JSON.parse(body).Actors);
        }
    });
}

//if do-what-it-says is called...
function dowhat() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");

        if (dataArr[0] === 'movie-this') {
            userInput = dataArr[1];
            movie();
        }
        if (dataArr[0] === 'spotify-this-song') {
            userInput = dataArr[1];
            spotifySong();
        }

    });

}
