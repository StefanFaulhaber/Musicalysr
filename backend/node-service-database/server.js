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

var artistsDummy = [
  {id: '59f8a607-e4f9-4166-8036-f40a286601ff', name: 'Joel Zimmerman'},
  {id: 'c046b587-5e98-4631-a5c0-e5d8e18d6b13', name: 'RL Grime'},
  {id: '61a54a1e-3fa1-4ccc-bfc2-86c1a27e27de', name: 'Baauer'},
  {id: '86a1c458-2d97-42cd-a142-a8fee30ae4a1', name: 'Chris Liebing'},
  {id: '056e4f3e-d505-4dad-8ec1-d04f521cbb56', name: 'Daft Punk'},
  {id: '65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab', name: 'Metallica'},
  {id: '9282c8b4-ca0b-4c6b-b7e3-4f7762dfc4d6', name: 'Nirvana'},
  {id: '67f66c07-6e61-4026-ade5-7e782fad3a5d', name: 'Foo Fighters'},
  {id: '7dc8f5bd-9d0b-4087-9f73-dc164950bbd8', name: 'Queens of the Stone Age'},
  {id: 'ea0f2a37-7007-4217-a812-396227f5013a', name: 'Kyuss'},
  {id: '678d88b2-87b0-403b-b63d-5da7465aecc3', name: 'Led Zeppelin'},
  {id: '4bc09c51-5d42-4c93-9ba6-8cc21a0edb8d', name: 'Them Crooked Vultures'},
  {id: '83d91898-7763-47d7-b03b-b92132375c47', name: 'Pink Floyd'},
  {id: 'b6b2bb8d-54a9-491f-9607-7b546023b433', name: 'Pixies'}
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

app.get('/query/artists/autocomplete/:name', function (req, res) {
  var name = req.params.name.toUpperCase();
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
    if (artist.name.toUpperCase().startsWith(name)) { //TODO: maybe substring testing here instead
      result.push(artist);
    }
  });
  res.setHeader('Content-Type', 'application/json');
  res.send(result);
});

app.post('/insert/artists', function (req, res) {
  var artists = req.body;
  var rows = [];

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
      rows.add(result.changedRows);
    });
  });

  res.setHeader('Content-Type', 'application/json');
  res.send({rows: rows});

  connection.disconnect(); // TODO: Check if all inserts are complete before disconnect!
});

/**
 * Starts the server.
 */
app.listen(port, function () {
  console.log('Database-Service is listening on port ' + port + '!');
});
