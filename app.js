// LIRI Command Line Application
var fs = require('fs');
var keys = require('./keys.js');
var request = require('request');
var spotify = require('node-spotify-api');
var sclient = new spotify(keys.spotifyKeys);


var twitter = require('twitter');
var tclient = new twitter(keys.twitterKeys);


var input = process.argv;
var command = input[2];
var title = input[3];


var tweetCommand = 'my-tweets';
var spotifyCommand = 'spotify-this-song';
var movieCommand = 'movie-this';
var randomCommand = 'do-what-it-says';


var liri = {
    evaluate: function() {
        if (command === tweetCommand) {
            liri.getTweets();

        } else if (command === spotifyCommand) {
            liri.getSong();

        } else if (command === movieCommand) {
            liri.getMovie();

        } else if (command === randomCommand) {
            liri.getRandom();

        } else {
            console.log('\n' + 'Command of ' + command + ' not found, please use one of the following: ' + '\n' + '\n' + 'my-tweets' + '\n' + '\n' + 'do-what-it-says' + '\n' + '\n' + 'spotify-this-song \"song title\"' + '\n' + '\n' + 'movie-this \"movie title\"' + '\n');
        };
    },


    getTweets: function() {
        var params = {
            screen_name: 'andalibkibria',
            count: 20
        };

        tclient.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                for (var i = 0; i < tweets.length; i++) {
                    console.log("");
                    console.log(tweets[i].created_at + ":");
                    console.log(tweets[i].text);
                }
            }
        });
    },


    getSong: function() {
        if (title === undefined) {
            title = "Bandz A Make Her Dance";
        }

        sclient.search({ type: 'track', query: title }, function(error, data) {
            if (error) {
                console.log('Error occurred: ' + error);
                return;
            }

            var info = data.tracks.items[0];
            var artist = info.artists[0].name
            var song = info.name;
            var album = info.album.name;
            var preview = info.preview_url;

            console.log('\n' + 'Artist: ' + artist);
            console.log('\n' + 'Song: ' + song);
            console.log('\n' + 'Album: ' + album)
            console.log('\n' + 'Preview: ' + preview);
        });
    },


    getMovie: function() {
        if (title === undefined) {
            title = "Borat";
        }

        var url = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=40e9cece";

        request(url, function(error, response, body) {

            var object = JSON.parse(body);

            if (!error && response.statusCode === 200) {
                console.log('\n' + 'Title: ' + object.Title + '\n');
                console.log('Release Year: ' + object.Year + '\n');
                console.log('IMDB Rating: ' + object.imdbRating + '\n');
                console.log('RT Rating: ' + object.Ratings[1].Value + '\n');
                console.log('Country: ' + object.Country + '\n');
                console.log('Language: ' + object.Language + '\n');
                console.log('Plot: ' + object.Plot + '\n');
                console.log('Actors: ' + object.Actors + '\n');
            }
        })
    },


    getRandom: function() {
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
                console.log(error);
            }

            var str = data.split(",")
            command = str[0]
            title = str[1];
            liri.getSong();
        })
    },


    logText: function() {
        if (command != undefined) {
            var string = new Date() + '\n' + command + " " + '"' + title + '"' + '\n' + '\n';
            fs.appendFile('log.txt', string, function(error) {
                if (error) {
                    console.log(error)
                }
            })

        } else {
            var errorString = new Date() + '\n' + 'ERROR: UNDEFINED ENTRY' + '\n' + '\n';
            fs.appendFile('log.txt', errorString, function(error) {
                if (error) {
                    console.log(error)
                }
            })
        }
    }
};


liri.evaluate();
liri.logText();