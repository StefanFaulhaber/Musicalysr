'use strict';
var bodyParser = require('body-parser');
var commandLineArgs = require('command-line-args');
var express = require('express');
var mysql = require('mysql');

const DEFAULT_PORT = 2050;

var optionDefinitions = [
  {name: 'port', alias: 'p', type: String, defaultValue: DEFAULT_PORT}
];

var cmdOptions = commandLineArgs(optionDefinitions);
var port = cmdOptions.port;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, content-type");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'database'
});

const artistsDummy = [
  {
    name: 'Artist 1',
    id: '1'
  },
  {
    name: 'Artist 2',
    id: '2'
  },
  {
    name: 'Artist 3',
    id: '3'
  }
];

app.get('/query/artists', function (req, res) {
  /*var sql = "SELECT ??. ?? FROM ??";
   var inserts = ['Name', 'id', 'Artists'];
   var query = mysql.format(sql, inserts);

   connection.connect();
   connection.query(query, function (err, rows, fields) {
   if (err) throw err;
   });
   connection.disconnect();*/

  res.setHeader('Content-Type', 'application/json');
  res.send(artistsDummy);
});

app.post('/query/artist/autocomplete/:name', function (req, res) {
  var name = req.params.name;
  /*var sql = "SELECT ??, ?? FROM ?? WHERE ?? = ?";
   var inserts = ['Name', 'id', 'Artists', 'Name', name + '%'];
   var query = mysql.format(sql, inserts);

   connection.connect();
   connection.query(query, function (err, rows, fields) {
   if (err) throw err;
   var result = [];
   rows.forEach(function (row) {
   result.push({name: row.name, id: row.id});
   });
   res.setHeader('Content-Type', 'application/json');
   res.send(result);
   });
   connection.disconnect();*/

  var result = [];
  artistsDummy.forEach(function (artist) {
    if (artist.name.startsWith(name)) {
      artist.push(result);
    }
  });
  res.setHeader('Content-Type', 'application/json');
  res.send(result);
});

app.post('/insert/artist', function (req, res) {
  var artists = req.body;

  connection.connect();

  artists.forEach(function (artist) {
    var sql = "INSERT INTO ?? (??, ??) VALUES (?, ?)";
    var inserts = ['Artist', artist.name, artist.id, 'Name'];
    var query = mysql.format(sql, inserts);

    connection.query(query, function (err, result) {
      if (err) {
        res.sendStatus(500);
        throw err;
      }
      var rows = result.changedRows;
      res.setHeader('Content-Type', 'application/json');
      res.send({rows: rows});
    });
  });

  connection.disconnect(); // TODO: Check if all inserts are complete before disconnect!
});

/**
 * Starts the server.
 */
app.listen(port, function () {
  console.log('Database-Service is listening on port ' + port + '!');
});
