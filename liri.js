//---------------------- REQUIRED LIBRARIES AND GLOBAL VARIABLE ----------------------

require("dotenv").config();

var keys = require("./keys.js");
var moment = require("moment");
var fs = require("fs");
var inquirer = require("inquirer");

var axios = require("axios");
var bandsintown = keys.bandsInTown;
var bandsInTownApi = bandsintown.id;

var Spotify = require("node-spotify-api");
var spotifyKeys = keys.spotify;
var spotifyId = spotifyKeys.id;
var spotifySecret = spotifyKeys.secret;
var spotify = new Spotify({
    id: spotifyId,
    secret: spotifySecret
});

var omdb = require("omdb-client");
var omdbKeys = keys.omdb;
omdbAPIkey = omdbKeys.id;

var chalk = require("chalk");
var invertedTitle = chalk.inverse;
var liriFound = invertedTitle("\n----------LOOK WHAT LIRI FOUND-----------\n");
var problem = invertedTitle("\n------------HOUSTON WE HAVE A PROBLEM-----------\n")


//------------------ INQUIRER QUESTIONS ARRAY ---------------------

var initializingQuestions = [{
    type: "list",
    name: "programs",
    message: "Hello, which of the following would you like to search?",
    choices: ["Spotify", "IMDB", "Concerts", "Surprise!"]
},
{
    type: "input",
    name: "movieSearch",
    message: "Which film would you like to search for?",
    validate: function (input) {
        var complete = this.async();

        setTimeout(function () {
            if (input === "") {
                console.log("Please enter a movie title.")
                return;
            }
            complete(null, true);
        }, 1000);
    },
    when: (answers) => {
        return answers.programs == "IMDB";
    }
},
{
    type: "input",
    name: "songSearch",
    message: "Which song would you like to search for?",
    validate: function (input) {
        var complete = this.async();

        setTimeout(function () {
            if (input === "") {
                console.log("Please enter a song title.")
                return;
            }
            complete(null, true);
        }, 1000);
    },
    when: (answers) => {
        return answers.programs == "Spotify";
    }
},
{
    type: "input",
    name: "artistSearch",
    message: "Which artist are you interested in searching for?",
    validate: function (input) {
        var done = this.async();
        
        setTimeout(function () {
            if (input === "") {
                console.log("Please enter an artist name.")
                return;
            }
            done(null, true);
        }, 1000);
    },
    when: (answers) => {
        return answers.programs == "Concerts";
    }
}
]

//--------------------- INQUIRER SWITCH FUNCTION -----------------------

inquirer
    .prompt(initializingQuestions)
    .then((answer) => {
        switch (answer.programs) {
            case "Spotify":
                spotifySearch(answer.songSearch);
                break;
            case "IMDB":
                imdbSearch(answer.movieSearch)
                break;
            case "Concerts":
                concertSearch(answer.artistSearch)
                break;
            case "Surprise!":
                surprise(surprise);
                break;
        }
    })
//------------------ SPOTIFY SEARCH ------------------

var spotifySearch = (song) => {
    spotify.search({ type: "track", query: song }, (error, song) => {
        if (error) {
            console.log(problem)
            return console.error(error)
        } else {
            var search = song.tracks.items
            var spotifyHeader = chalk.green("\n---------TOP 3 SEARCH RESULTS-----------")
            console.log(spotifyHeader);
            var counter = 0;
            var limit = 3;

            for (var songs of search) {
                var songTitle = songs.name;
                var albumTitle = songs.album.name;
                var artistName = songs.album.artists[0].name;
                var url = songs.album.external_urls.spotify

                console.log(liriFound +
                    chalk.bold("\nSong Title: ") + "'" + songTitle + "'" + "\n" +
                    chalk.bold("\nArtist Name: ") + artistName +
                    chalk.bold("\nAlbum Title: ") + albumTitle +
                    chalk.bold("\nStill Curious?: ") + url)

                console.log(invertedTitle("\n----------------------\n"))

                if (++counter >= limit)
                    break;
            }
        }
    })
}

//---------------- OMDB SEARCH --------------------

var imdbSearch = (movie) => {
    var params =
    {
        apiKey: omdbAPIkey,
        title: movie
    }

    omdb.get(params, (error, movie) => {
        if (error) {
            return console.error(problem + error);
        } else if (!movie) {
            return console.error("Uhhhhh, never heard of that movie.");
        }

        console.log(liriFound +
            "\nMovie Title: " + chalk.underline(movie.Title) +
            "\nMovie Rating: " + movie.imdbRating +
            "\nReleased In: " + movie.Year +
            "\nRotten Tomatoes Score: " + movie.Ratings[1].Value + "/10" +
            "\nPlot: " + movie.Plot +
            "\nAwards Received: " + movie.Awards
        )
        console.log(invertedTitle("\n----------------------\n"))
    });
}


//-------------------- BANDS IN TOWN SEARCH --------------------

var concertSearch = (artist) => {
    if (artist === "") {
        return console.log("Don't know that one, let's try it again!");
    }

    var artistName = artist.replace(/\s/g, '')
    var searchUrl = 'https://rest.bandsintown.com/artists/' + artistName + '/events?app_id=' + bandsInTownApi;
    axios.get(searchUrl)
        .then((response) => {
            concerts = response.data;
            if (concerts.length === 0) {
                console.log(problem);
                console.log("\nTry a different artist!");
            } else {
                var counter = 0;
                var limit = 3;
                var resultsHeader = chalk.bold.green("\n----------LIRI FOUND THESE TOP 3 RESULTS-------------")
                console.log(resultsHeader);
                for (var concert of concerts) {
                    var date = "Date: " + moment(concert.datetime).format("dddd, MMMM do YYYY h:mm:ss a");
                    var venue = `Venue Name: ${concert.venue.name}`;
                    var venueCity = `City: ${concert.venue.city}`;
                    var venueRegion = `Region: ${concert.venue.region}`;
                    var venueCountry = `Country: ${concert.venue.country}`;
                    var act = `Artist: ${concert.lineup}`;

                    console.log(
                        chalk.underline(act) +
                        "\n" + date +
                        "\n" + venue +
                        "\n" + venueCity +
                        "\n" + venueRegion +
                        "\n" + venueCountry
                    );

                    if (++counter >= limit)
                        break;
                }
            }
        })
        .catch((error) => {
            return console.error(problem + error);
        })
}

//------------------ SURPRISE ME! ------------------------

var surprise = (userSearch) => {
    var min = 1;
    var max = 3;
    var random = parseInt(Math.random() * (max - min) + min);

    fs.readFile('./random/random' + random + '.txt', 'utf8', (error, data) => {
        if (error) {
            return console.error("Oops. Looks like that information we can't search. " + error);
        } else {
            var fileContent = data.split(',');
            userSearch = fileContent[1];
            switch (fileContent[0]) {
                case "Spotify":
                    spotifySearch(userSearch);
                    break;
                case "IMDB":
                    imdbSearch(userSearch);
                    break;
                case "Concerts":
                    concertSearch(userSearch);
                    break;
                case "Suprise!":
                    suprise();
                    break;
                default:
                    console.log(problem);
            }
        }
    });
}
