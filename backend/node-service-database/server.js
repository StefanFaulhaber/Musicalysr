'use strict';
var bodyParser = require('body-parser');
var commandLineArgs = require('command-line-args');
var express = require('express');
var pg = require('pg');

const DEFAULT_PORT = 2050;

var optionDefinitions = [
  {name: 'port', alias: 'p', type: String, defaultValue: DEFAULT_PORT}
];

var cmdOptions = commandLineArgs(optionDefinitions);
var port = cmdOptions.port;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, content-type");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

var config = {
  user: 'musicbrainz', //env var: PGUSER
  database: 'musicbrainz', //env var: PGDATABASE
  password: 'musicbrainz', //env var: PGPASSWORD
  port: 8888, //env var: PGPORT
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

var client = new pg.Pool(config);

app.get('/query/artists', function(req, res) {
  client.connect(function(err) {
    if (err) throw err;

    var query = 'SELECT id, name FROM artist ORDER BY name ASC LIMIT 50'

    client.query(query, [], function(err, result) {
      if (err) throw err;

      res.setHeader('Content-Type', 'application/json');
      res.send(result.rows);
    });
  });
});

app.get('/query/artists/autocomplete/:name', function(req, res) {
  client.connect(function(err) {
    if (err) throw err;

    var name = req.params.name.toUpperCase() + '%';
    var query = 'SELECT id, name FROM label WHERE name LIKE $1 ORDER BY name ASC LIMIT 50';

    client.query(query, [name], function(err, result) {
      if (err) throw err;

      res.setHeader('Content-Type', 'application/json');
      res.send(result.rows);

      client.end(function(err) {
        if (err) throw err;
      });
    });
  });
});

app.get('/query/labels', function(req, res) {
  client.connect(function(err) {
    if (err) throw err;

    var query = 'SELECT id, name FROM label ORDER BY name ASC LIMIT 50';

    client.query(query, [], function(err, result) {
      if (err) throw err;

      res.setHeader('Content-Type', 'application/json');
      res.send(result.rows);

      client.end(function(err) {
        if (err) throw err;
      });
    });
  });
});

app.get('/query/labels/autocomplete/:name', function(req, res) {
  client.connect(function(err) {
    if (err) throw err;

    var name = req.params.name.toUpperCase() + '%';
    var query = 'SELECT id, name FROM label WHERE UPPER(name) LIKE $1 ORDER BY name ASC LIMIT 50';

    client.query(query, [name], function(err, result) {
      if (err) throw err;

      res.setHeader('Content-Type', 'application/json');
      res.send(result.rows);

      client.end(function(err) {
        if (err) throw err;
      });
    });
  });
});

app.get('/query/artist/labels/:id', function(req,res) {
  client.connect(function(err) {
    if (err) throw err;

    var id = req.params.id;
    var query = 'SELECT label.id, label.name ' +
      'FROM label NATURAL JOIN area NATURAL JOIN artist ' +
      'WHERE artist.id = $1 ' +
      'ORDER BY name ASC ' +
      'LIMIT 50';

    client.query(query, [id], function(err, result) {
      if (err) throw err;

      res.setHeader('Content-Type', 'application/json');
      res.send(result.rows);

      client.end(function(err) {
        if (err) throw err;
      });
    });
  });
});

/**
 * Starts the server.
 */
app.listen(port, function() {
  console.log('Database-Service is listening on port ' + port + '!');
});
