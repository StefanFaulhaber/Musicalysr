'use strict';
var commandLineArgs = require('command-line-args');
var express = require('express');
var fs = require('fs');
var io = require('socket.io');
var path = require('path');
var Twitter = require('twitter');

const DEFAULT_PORT = 2049;
const INTERVAL = 900000; // 900000 ms = 15 min

var optionDefinitions = [
  {name: 'port', alias: 'p', type: String, defaultValue: DEFAULT_PORT}
];

var cmdOptions = commandLineArgs(optionDefinitions);
var port = cmdOptions.port;

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, content-type");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

var authFile = path.join(__dirname, 'auth.json');
var tmpFile = path.join(__dirname, 'tmp', 'output.json');

if (fs.existsSync(authFile)) {
  var auth = require(authFile);
  var client = new Twitter(auth.auth);
}
else {
  console.log('No auth file detected');
  process.exit(1);
}

var socket = io.listen(app.listen(port, function() {
  console.log('Service is listening on PORT ' + DEFAULT_PORT + '!');
}));

socket.sockets.on('connection', function(socket) {
  console.log('User connected. Socket id %s', socket.id);

  socket.on('disconnect', function() {
    console.log('User disconnected. Socket id %s', socket.id);
  });
});

var tweetBuffer = [];
var params = {language: 'de,en'};

client.stream('statuses/sample', params, function(stream) {
  stream.on('data', function(data) {
    var tweet = {
      date: data.created_at,
      text: data.text
    };

    if (data.user) {
      if (data.user.name) {
        tweet['name'] = data.user.name;
      }

      if (data.user.screen_name) {
        tweet['screen_name'] = data.user.screen_name;
      }

      if (data.user.location) {
        tweet['location'] = data.user.location;
      }

      if (data.user.followers_count) {
        tweet['followers_count'] = data.user.followers_count;
      }

      if (data.user.favourites_count) {
        tweet['favourites_count'] = data.user.favourites_count;
      }
    }

    if (data.entities) {
      tweet['entities'] = data.entities;
    }

    if (data.place) {
      tweet['place'] = data.place;
    }

    if (data.retweet_count) {
      tweet['retweet_count'] = data.retweet_count;
    }

    if (data.retweeted) {
      tweet['retweeted'] = data.retweeted;
    }

    if (data.lang) {
      tweet['lang'] = data.lang;
    }

    tweetBuffer.push(tweet);
  });

  setInterval(function() {
    var output = {
      timeStamp: new Date(),
      data: tweetBuffer
    };
    socket.sockets.emit('tweet', output);
    fs.appendFileSync(tmpFile, JSON.stringify(output) + '\n');
    console.log(output);
    tweetBuffer = [];
  }, INTERVAL);
});
