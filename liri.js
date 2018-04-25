require("dotenv").config();

var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var keys = require("./keys.js");
var fs = require("fs");

var command = process.argv[2];
var secondCommand = process.argv.slice(3).join(" ");
var movieName = process.argv.slice(3).join("+");

var newSpotify = new spotify(keys.spotify);
var client = new twitter(keys.twitter);

switch (command) {
    case 'my-tweet':
        myTweets();
        break;

    case 'spotify-this-song':
        spotifyThis();
        break;

    case 'movie-this':
        getOmdb();
        break;

    case 'do-what-it-says':
        makeRequest();
        break;

    default:
        break;
}

function myTweets() {
    var params = { screen_name: 'MaldrekWebDev' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log(`Username: "${tweets[0].user.screen_name}", created on ${tweets[0].created_at}: "${tweets[0].text}"`);
        }
    });
}

function spotifyThis() {
    newSpotify.search({ type: 'track', query: secondCommand }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(`Album: "${data.tracks.items[0].album.name}" by ${data.tracks.items[0].artists[0].name}. Released on: ${data.tracks.items[0].album.release_date}.`);
    });
}

function getOmdb() {
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (secondCommand === "") {
            request(("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy"), function (error, response, body) {

                if (!error && response.statusCode === 200) {
                    let parseBody = JSON.parse(body);
                    console.log(`
            "${parseBody.Title}": rated '${parseBody.Rated}', released in year ${parseBody.Year} in ${parseBody.Country}.
            IMDB Rating: ${parseBody.Ratings[0].Value}
            Rotten Tomatoes Rating: ${parseBody.Ratings[1].Value}
            Languages: ${parseBody.Language}
            Plot: "${parseBody.Plot}"
            Notable Actors: ${parseBody.Actors}
            `);
                }
            });
        } else {
            if (!error && response.statusCode === 200) {
                let parseBody = JSON.parse(body);
                console.log(`
            "${parseBody.Title}": rated '${parseBody.Rated}', released in year ${parseBody.Year} in ${parseBody.Country}.
            IMDB Rating: ${parseBody.Ratings[0].Value}
            Rotten Tomatoes Rating: ${parseBody.Ratings[1].Value}
            Languages: ${parseBody.Language}
            Plot: "${parseBody.Plot}"
            Notable Actors: ${parseBody.Actors}
            `);
            }
        }
    });
}


function makeRequest() {
    function doWhatItSays() {
        fs.readFile("random.txt", "utf8", function (error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
                return console.log(error);
            };

            // Create an array of data from the random.txt file
            var dataArr = data.split(",");

            // Set the input for the liriCommand to the first item in the array
            input1 = dataArr[0];

            // Set the search term as a combination of any other data that comes after the initial command in the random.txt file
            for (i = 1; i < dataArr.length; i++) {
                searchTerm = searchTerm + " " + dataArr[i];
            };

            // Call the liriCommand function to use the random.txt data to perform a liri function
            liriCommand(command, secondCommand);
        });
    };
}