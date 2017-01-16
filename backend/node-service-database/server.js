'use strict';
var bodyParser = require('body-parser');
var commandLineArgs = require('command-line-args');
var express = require('express');
var mysql = require('mysql');

const DEFAULT_LIMIT = 200;
const DEFAULT_PORT = 2050;

const optionDefinitions = [
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
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mbdb'
};

var pool = mysql.createPool(config);

/**
 * Get artists from a given offset and limit.
 */
app.get('/query/artists/:offset', function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else {
      var offset = req.params.offset;
      var query = 'SELECT id, name FROM artist ORDER BY name ASC LIMIT ' + DEFAULT_LIMIT + ' OFFSET ' + offset;

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
});

/**
 * Get artists where the name starts with a given string.
 */
app.post('/query/artists/autocomplete/name', function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else {
      var name = req.body.name.toUpperCase() + '%';
      var query = 'SELECT id, name FROM artist WHERE UPPER(name) LIKE ? ORDER BY name ASC LIMIT ' + DEFAULT_LIMIT;
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
});

/**
 * Get artist for a given id.
 */
app.get('/query/artist/:id', function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else {
      var id = req.params.id;
      var query = 'SELECT id, name FROM artist WHERE id = ?';
      var parameters = [id];
      var sql = mysql.format(query, parameters);

      connection.query(sql, function(err, rows, fields) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          res.send(rows[0]);
        }
        connection.release();
      });
    }
  });
});

/**
 * Get label for a given id.
 */
app.get('/query/label/:id', function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else {
      var id = req.params.id;
      var query = 'SELECT id, name FROM label WHERE id = ?';
      var parameters = [id];
      var sql = mysql.format(query, parameters);

      connection.query(sql, function(err, rows, fields) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          res.send(rows[0]);
        }
        connection.release();
      });
    }
  });
});

/**
 * Get labels from a given offset and limit.
 */
app.get('/query/labels/:offset', function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else {
      var offset = req.params.offset;
      var query = 'SELECT id, name FROM label ORDER BY name ASC LIMIT ' + DEFAULT_LIMIT + ' OFFSET ' + offset;

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
});

/**
 * Get labels where the name starts with a given string.
 */
app.post('/query/labels/autocomplete/name', function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else {
      var name = req.body.name.toUpperCase() + '%';
      var query = 'SELECT id, name FROM label WHERE UPPER(name) LIKE ? ORDER BY name ASC LIMIT ' + DEFAULT_LIMIT;
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
});

/**
 * Get all labels associated with a given artists by its id.
 */
app.get('/query/artist/labels/:id', function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else {
      var id = req.params.id;
      var query = 'SELECT DISTINCT ' +
        'label.id, ' +
        'label.name ' +
        'FROM label ' +
        'JOIN release_label ' +
        'ON label.id = release_label.label ' +
        'JOIN `release` ' +
        'ON release_label.`release` = `release`.id ' +
        'JOIN artist_credit ' +
        'ON `release`.artist_credit = artist_credit.id ' +
        'JOIN artist_credit_name ' +
        'ON artist_credit.id = artist_credit_name.artist_credit ' +
        'JOIN artist ' +
        'ON artist_credit_name.artist = artist.id ' +
        'WHERE artist.id = ' + id;

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
});

/**
 * Get all releases associated with a given artists by its id.
 */
app.get('/query/artist/releases/:id', function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else {
      var id = req.params.id;
      var query = 'SELECT ' +
        'release_group.id, ' +
        'release_group.name, ' +
        'release_group_primary_type.name AS type ' +
        'FROM artist ' +
        'JOIN artist_credit_name ' +
        'ON artist.id = artist_credit_name.artist ' +
        'JOIN artist_credit ' +
        'ON artist_credit_name.artist_credit = artist_credit.id ' +
        'JOIN release_group ' +
        'ON artist_credit.id = release_group.artist_credit ' +
        'JOIN release_group_primary_type ' +
        'ON release_group.type = release_group_primary_type.id ' +
        'WHERE artist.id = ' + id + ' ' +
        'ORDER BY release_group.name ASC ';

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
});

/**
 * Get all tracks for a given release by its id. TODO: Needs recording table to work
 */
app.get('/query/release/track/:id', function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else {
      res.sendStatus(200);
      /*
       var id = req.params.id;
       var query = 'SELECT track.id, track.name, track.number, track.length ' +
       'FROM track NATURAL JOIN ' +
       'recording NATURAL JOIN ' +
       'artist_credit NATURAL JOIN ' +
       'release_group NATURAL JOIN ' +
       'release ' +
       'WHERE release.id = ? ' +
       'ORDER BY name ASC ' +
       'LIMIT ?';
       var parameters = [id, DEFAULT_LIMIT];
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
       });*/
    }
  });
});

/**
 * Insert Twitter data into the database.
 */
app.post('/insert/twitter', function(req, res) {
  var json = req.body;
  res.setHeader('Content-Type', 'application/json');
  res.send(json);

  /*var timeStamp = json.timeStamp;
  var numberOfTweets = json.numberOfTweets;
  var coocurences = json.coocurences;
  var frequencies = json.frequencies;

  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else {
      var json = req.body;
      var query = 'INSERT INTO Placeholder VALUES()';

      connection.query(query, function(err, result) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          res.send(200);
        }
        connection.release();
      });
    }
  });*/
});

/**
 * Starts the server.
 */
app.listen(port, function() {
  console.log('Database-Service is listening on port ' + port + '!');
});

///////////////////////
// Private functions //
///////////////////////

function createTwitterTables() {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else {
      connection.query(query, function(err, result) {
        if (err) {
          console.error(err);
        }
        else {
          var createTimeStampTable = "CREATE TABLE IF NOT EXISTS timestamp(" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "timestamp_id INTEGER, " +
            "number_of_tweets INTEGER";

          var createFrequenziesTable = "CREATE TABLE IF NOT EXISTS frequency(" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "timestamp_id INTEGER, " +
            "artist_id INTEGER, " +
            "count INTEGER, " +
            "FOREIGN KEY (artist_id) REFERENCES artist(id)" +
            "FOREIGN KEY (timestamp_id) REFERENCES timestamp(id)";

          var createCoocurencesTable = "CREATE TABLE IF NOT EXISTS frequency(" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "timestamp_id INTEGER, " +
            "artist_id_1 INTEGER, " +
            "artist_id_1 INTEGER, " +
            "FOREIGN KEY (artist_id_1) REFERENCES artist(id)" +
            "FOREIGN KEY (artist_id_2) REFERENCES artist(id)" +
            "FOREIGN KEY (timestamp_id) REFERENCES timestamp(id)";
        }
        connection.release();
      });
    }
  });
}
