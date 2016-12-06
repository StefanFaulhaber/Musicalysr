'use strict';
var bodyParser = require('body-parser');
var commandLineArgs = require('command-line-args');
var express = require('express');
var mysql = require('mysql');
var pg = require('pg');

const DEFAULT_PORT = 2050;
const DATABASE_MYSQL = "mysql";
const DATABASE_POSTGRESQL = "postgresql";

const optionDefinitions = [
  {name: 'port', alias: 'p', type: String, defaultValue: DEFAULT_PORT},
  {name: 'database', alias: 'd', type: String, defaultValue: DATABASE_POSTGRESQL}
];

var cmdOptions = commandLineArgs(optionDefinitions);
var port = cmdOptions.port;
var database = cmdOptions.database;

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

if (database === DATABASE_MYSQL) {
  var configMySQL = {
    host: 'localhost',
    user: 'musicbrainz',
    password: 'musicbrainz',
    database: 'musicbrainz'
  };

  var connection = mysql.createConnection(configMySQL);
}
else if (database === DATABASE_POSTGRESQL) {
  var configPostgreSQL = {
    user: 'musicbrainz', //env var: PGUSER
    database: 'musicbrainz', //env var: PGDATABASE
    password: 'musicbrainz', //env var: PGPASSWORD
    port: 8888, //env var: PGPORT
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
  };

  var client = new pg.Pool(configPostgreSQL);
}
else {
  throw 'Database must be either "mysql" or "postgresql"!';
}


app.get('/query/artists', function(req, res) {
  var query = 'SELECT id, name FROM artist ORDER BY name ASC LIMIT 50'

  if (database === DATABASE_MYSQL) {
    connection.connect();

    connection.query(query, function(err, rows, fields) {
      if (err) throw err;

      res.setHeader('Content-Type', 'application/json');
      res.send(rows);

      connection.end();
    });
  }
  else {
    client.connect(function(err) {
      if (err) throw err;

      client.query(query, [], function(err, result) {
        if (err) throw err;

        res.setHeader('Content-Type', 'application/json');
        res.send(result.rows);
      });
    });
  }
});

app.get('/query/artists/autocomplete/:name', function(req, res) {
  var name = req.params.name.toUpperCase() + '%';

  if (database === DATABASE_MYSQL) {
    var query = 'SELECT id, name FROM artist WHERE UPPER(name) LIKE ? ORDER BY name ASC LIMIT 50';
    var parameters = [name];
    var sql = mysql.format(query, parameters);

    connection.connect();

    connection.query(sql, function(err, rows, fields) {
      if (err) throw err;

      res.setHeader('Content-Type', 'application/json');
      res.send(rows);

      connection.disconnect();
    });
  }
  else {
    client.connect(function(err) {
      if (err) throw err;

      var query = 'SELECT id, name FROM artist WHERE UPPER(name) LIKE $1 ORDER BY name ASC LIMIT 50';

      client.query(query, [name], function(err, result) {
        if (err) throw err;

        res.setHeader('Content-Type', 'application/json');
        res.send(result.rows);

        client.end(function(err) {
          if (err) throw err;
        });
      });
    });
  }
});

app.get('/query/labels', function(req, res) {
  var query = 'SELECT id, name FROM label ORDER BY name ASC LIMIT 50';

  if (database === DATABASE_MYSQL) {
    connection.connect();

    connection.query(query, function(err, rows, fields) {
      if (err) throw err;

      res.setHeader('Content-Type', 'application/json');
      res.send(rows);

      connection.end();
    });
  }
  else {
    client.connect(function(err) {
      if (err) throw err;

      client.query(query, [], function(err, result) {
        if (err) throw err;

        res.setHeader('Content-Type', 'application/json');
        res.send(result.rows);

        client.end(function(err) {
          if (err) throw err;
        });
      });
    });
  }
});

app.get('/query/labels/autocomplete/:name', function(req, res) {
  var name = req.params.name.toUpperCase() + '%';

  if (database === DATABASE_MYSQL) {
    var query = 'SELECT id, name FROM label WHERE UPPER(name) LIKE ? ORDER BY name ASC LIMIT 50';
    var parameters = [name];
    var sql = mysql.format(query, parameters);

    connection.connect();

    connection.query(sql, function(err, rows, fields) {
      if (err) throw err;

      res.setHeader('Content-Type', 'application/json');
      res.send(rows);

      connection.disconnect();
    });
  }
  else {
    client.connect(function(err) {
      if (err) throw err;

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
  }
});

app.get('/query/artist/labels/:id', function(req, res) {
  var id = req.params.id;

  if (database === DATABASE_MYSQL) {
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

      connection.disconnect();
    });
  }
  else {
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
  }
});

/**
 * Starts the server.
 */
app.listen(port, function() {
  console.log('Database-Service is listening on port ' + port + '!');
});
