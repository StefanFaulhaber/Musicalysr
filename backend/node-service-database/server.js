'use strict';
var bodyParser = require('body-parser');
var commandLineArgs = require('command-line-args');
var express = require('express');
var mysql = require('mysql');
var pg = require('pg');

const DEFAULT_PORT = 2050;

const optionDefinitions = [
  {name: 'port', alias: 'p', type: String, defaultValue: DEFAULT_PORT},
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
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mbdb'
};

var connection = mysql.createConnection(config);
var pool = mysql.createPool(config);

app.get('/query/artists', function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else {
      var query = 'SELECT id, name FROM artist ORDER BY name ASC LIMIT 500';

      connection.query(query, function(err, rows, fields) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          res.send(rows);
        }
        connection.release();
      });
    }
  });

  /*var query = 'SELECT id, name FROM artist ORDER BY name ASC LIMIT 500';

   connection.connect();

<<<<<<< HEAD
   connection.query(query, function(err, rows, fields) {
   if (err) throw err;
=======
     //connection.end();
    });
  }
  else {
    client.connect(function(err) {
      if (err) throw err;
>>>>>>> dbf2b12117c290553d1f0b6b869d285b81fb1f40

   res.setHeader('Content-Type', 'application/json');
   res.send(rows);

   connection.end();
   });*/
});

app.get('/query/artists/autocomplete/:name', function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else {
      var name = req.params.name.toUpperCase() + '%';
      var query = 'SELECT id, name FROM artist WHERE UPPER(name) LIKE ? ORDER BY name ASC LIMIT 500';
      var parameters = [name];
      var sql = mysql.format(query, parameters);

      connection.query(sql, function(err, rows, fields) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          res.send(rows);
        }
        connection.release();
      });
    }
  });
  /*var name = req.params.name.toUpperCase() + '%';

   var query = 'SELECT id, name FROM artist WHERE UPPER(name) LIKE ? ORDER BY name ASC LIMIT 50';
   var parameters = [name];
   var sql = mysql.format(query, parameters);

<<<<<<< HEAD
   connection.connect();
=======
      //connection.end();
    });
  }
  else {
    client.connect(function(err) {
      if (err) throw err;
>>>>>>> dbf2b12117c290553d1f0b6b869d285b81fb1f40

   connection.query(sql, function(err, rows, fields) {
   if (err) throw err;

   res.setHeader('Content-Type', 'application/json');
   res.send(rows);

   connection.end();
   });*/
});

app.get('/query/labels', function(req, res) {
  var query = 'SELECT id, name FROM label ORDER BY name ASC LIMIT 50';

  connection.connect();

  connection.query(query, function(err, rows, fields) {
    if (err) throw err;

    res.setHeader('Content-Type', 'application/json');
    res.send(rows);

    connection.end();
  });
});

app.get('/query/labels/autocomplete/:name', function(req, res) {
  var name = req.params.name.toUpperCase() + '%';

  var query = 'SELECT id, name FROM label WHERE UPPER(name) LIKE ? ORDER BY name ASC LIMIT 50';
  var parameters = [name];
  var sql = mysql.format(query, parameters);

  connection.connect();

  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;

    res.setHeader('Content-Type', 'application/json');
    res.send(rows);

    connection.end();
  });
});

app.get('/query/artist/labels/:id', function(req, res) {
  var id = req.params.id;

  var query = 'SELECT label.id, label.name ' +
    'FROM label NATURAL JOIN area NATURAL JOIN artist ' +
    'WHERE artist.id = ? ' +
    'ORDER BY name ASC ' +
    'LIMIT 50';
  var parameters = [id];
  var sql = mysql.format(query, parameters);

  connection.connect();

  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;

    res.setHeader('Content-Type', 'application/json');
    res.send(rows);

    connection.end();
  });
});

/**
 * Starts the server.
 */
app.listen(port, function() {
  console.log('Database-Service is listening on port ' + port + '!');
});
