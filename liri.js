//list of required libraries and global variables

require("dotenv").config();

var keys = require("./keys.js");
var moment = require("moment");
var fs = require("fs");
var inquirer = require("inquirer");

var spotify = new Spotify(keys.spotify);

