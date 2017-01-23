'use strict';
var bodyParser = require('body-parser');
var commandLineArgs = require('command-line-args');
var express = require('express');
var mysql = require('mysql');

const DEFAULT_LIMIT = 100;
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
  database: 'mbdb',
  multipleStatements: true
};

var pool = mysql.createPool(config);

createTwitterTables(); // Create tables for Twitter data collection.

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

      connection.query(query, function(err, rows) {
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

      connection.query(sql, function(err, rows) {
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

      connection.query(sql, function(err, rows) {
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

      connection.query(sql, function(err, rows) {
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

      connection.query(query, function(err, rows) {
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
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else {
      var json = req.body;
      var timeStamp = json.timeStamp;
      var numberOfTweets = json.numberOfTweets;
      var frequencies = json.frequencies;
      var cooccurences = json.cooccurences;

      var insertTimeStamp = "INSERT INTO timestamp(timestamp, number_of_tweets) VALUES (?, ?)";
      var parameters = [timeStamp, numberOfTweets];
      var insertTimeStampSql = mysql.format(insertTimeStamp, parameters);

      connection.query(insertTimeStampSql, function(err, result) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        }
        else {
          var timeStampId = result.insertId;
          var frequenciesArtist = [];
          var frequenciesRelease = [];
          var frequenciesWork = [];
          var cooccurencesArtist = [];
          var cooccurencesRelease = [];
          var cooccurencesWork = [];

          frequencies.forEach(function(frequency) {
            if (frequency.type === "artist") {
              frequenciesArtist.push([timeStampId, frequency.id, frequency.count]);
            }
            else if (frequency.type === "release") {
              frequenciesRelease.push([timeStampId, frequency.id, frequency.count]);
            }
            else if (frequency.type === "work") {
              frequenciesWork.push([timeStampId, frequency.id, frequency.count]);
            }
          });

          insertFrequenciesArtist(frequenciesArtist);
          insertFrequenciesRelease(frequenciesRelease);
          insertFrequenciesWork(frequenciesWork);

          if (cooccurences.artist) {
            cooccurences.artist.forEach(function(cooccurency) {
              cooccurencesArtist.push([timeStampId, cooccurency.id_1, cooccurency.id_2, getType(cooccurency.type), cooccurency.count]);
            });
            insertCooccurencesArtist(cooccurencesArtist);
          }

          if (cooccurences.release) {
            cooccurences.release.forEach(function(cooccurency) {
              cooccurencesRelease.push([timeStampId, cooccurency.id_1, cooccurency.id_2, getType(cooccurency.type), cooccurency.count]);
            });
            insertCooccurencesRelease(cooccurencesRelease);
          }

          if (cooccurences.work) {
            cooccurences.work.forEach(function(cooccurency) {
              cooccurencesWork.push([timeStampId, cooccurency.id_1, cooccurency.id_2, getType(cooccurency.type), cooccurency.count]);
            });
            insertCooccurencesWork(cooccurencesWork);
          }
          res.sendStatus(200);
        }
      });
    }
  });
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

/**
 * Create tables for Twitter data collection.
 */
function createTwitterTables() {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
    }
    else {
      var createTimeStampTable = "CREATE TABLE IF NOT EXISTS timestamp (" +
        "id INTEGER PRIMARY KEY AUTO_INCREMENT," +
        "timestamp TIMESTAMP," +
        "number_of_tweets INTEGER" +
        ");";

      var createFrequenciesArtistTable = "CREATE TABLE IF NOT EXISTS frequency_artist(" +
        "id INTEGER PRIMARY KEY AUTO_INCREMENT," +
        "timestamp_id INTEGER, " +
        "artist_id INTEGER, " +
        "count INTEGER, " +
        "FOREIGN KEY (artist_id) REFERENCES artist(id)," +
        "FOREIGN KEY (timestamp_id) REFERENCES timestamp(id)" +
        ");";

      var createFrequenciesReleaseTable = "CREATE TABLE IF NOT EXISTS frequency_release(" +
        "id INTEGER PRIMARY KEY AUTO_INCREMENT," +
        "timestamp_id INTEGER, " +
        "release_group_id INTEGER, " +
        "count INTEGER, " +
        "FOREIGN KEY (release_group_id) REFERENCES release_group(id)," +
        "FOREIGN KEY (timestamp_id) REFERENCES timestamp(id)" +
        ");";

      var createFrequenciesWorkTable = "CREATE TABLE IF NOT EXISTS frequency_work(" +
        "id INTEGER PRIMARY KEY AUTO_INCREMENT," +
        "timestamp_id INTEGER, " +
        "work_id INTEGER, " +
        "count INTEGER, " +
        "FOREIGN KEY (work_id) REFERENCES work(id)," +
        "FOREIGN KEY (timestamp_id) REFERENCES timestamp(id)" +
        ");";

      var createCooccurrencesArtistTable = "CREATE TABLE IF NOT EXISTS cooccurrence_artist(" +
        "id INTEGER PRIMARY KEY AUTO_INCREMENT," +
        "timestamp_id INTEGER, " +
        "artist_id INTEGER, " +
        "id_2 INTEGER, " +
        "id_2_type INTEGER, " +
        "count INTEGER, " +
        "FOREIGN KEY (artist_id) REFERENCES artist(id)," +
        "FOREIGN KEY (timestamp_id) REFERENCES timestamp(id)" +
        ");";

      var createCooccurrencesReleaseTable = "CREATE TABLE IF NOT EXISTS cooccurrence_release(" +
        "id INTEGER PRIMARY KEY AUTO_INCREMENT," +
        "timestamp_id INTEGER, " +
        "release_group_id INTEGER, " +
        "id_2 INTEGER, " +
        "id_2_type INTEGER, " +
        "count INTEGER, " +
        "FOREIGN KEY (release_group_id) REFERENCES release_group(id)," +
        "FOREIGN KEY (timestamp_id) REFERENCES timestamp(id)" +
        ");";

      var createCooccurrencesWorkTable = "CREATE TABLE IF NOT EXISTS cooccurrence_work(" +
        "id INTEGER PRIMARY KEY AUTO_INCREMENT," +
        "timestamp_id INTEGER, " +
        "work_id INTEGER, " +
        "id_2 INTEGER, " +
        "id_2_type INTEGER, " +
        "count INTEGER, " +
        "FOREIGN KEY (work_id) REFERENCES work(id)," +
        "FOREIGN KEY (timestamp_id) REFERENCES timestamp(id)" +
        ");";

      connection.query(createTimeStampTable +
        createFrequenciesArtistTable +
        createFrequenciesReleaseTable +
        createFrequenciesWorkTable +
        createCooccurrencesArtistTable +
        createCooccurrencesReleaseTable +
        createCooccurrencesWorkTable, function(err) {
        if (err) {
          console.log(err);
        }
        connection.release();

        createIndexFrequenciesArtist();
        createIndexFrequenciesRelease();
        createIndexFrequenciesWork();
        createIndexCooccurrencesArtist();
        createIndexCooccurrencesRelease();
        createIndexCooccurrencesWork();

      });
    }
  });
}

/**
 * Matches the type to an integer value.
 * @param type artist, release or work
 * @returns {number} artist = 0, release = 1, work = 2
 */
function getType(type) {
  if (type === "artist") {
    return 0;
  }
  else if (type === "release") {
    return 1;
  }
  else if (type === "work") {
    return 2;
  }
  return -1;
}

/**
 * Insert frequencies for artists.
 * @param frequencies artist frequencies
 */
function insertFrequenciesArtist(frequencies) {
  if (frequencies.length > 0) {
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error(err);
      }
      var insertFrequencyArtist = "INSERT INTO frequency_artist(timestamp_id, artist_id, count) VALUES ?";

      connection.query(insertFrequencyArtist, [frequencies], function(err) {
        if (err) {
          console.log(err);
        }
        connection.release();
      });
    });
  }
}

/**
 * Insert frequencies for releases.
 * @param frequencies release frequencies
 */
function insertFrequenciesRelease(frequencies) {
  if (frequencies.length > 0) {
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error(err);
      }
      var insertFrequencyRelease = "INSERT INTO frequency_release(timestamp_id, release_group_id, count) VALUES ?";

      connection.query(insertFrequencyRelease, [frequencies], function(err) {
        if (err) {
          console.log(err);
        }
        connection.release();
      });
    });
  }
}

/**
 * Insert frequencies for work.
 * @param frequencies work frequencies
 */
function insertFrequenciesWork(frequencies) {
  if (frequencies.length > 0) {
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error(err);
      }
      var insertFrequencyWork = "INSERT INTO frequency_work(timestamp_id, work_id, count) VALUES ?";

      connection.query(insertFrequencyWork, [frequencies], function(err) {
        if (err) {
          console.log(err);
        }
        connection.release();
      });
    });
  }
}

/**
 * Insert cooccurences for artists.
 * @param cooccurences artist cooccurences
 */
function insertCooccurencesArtist(cooccurences) {
  if (cooccurences.length > 0) {
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error(err);
      }
      var insertCooccurencesArtist = "INSERT INTO cooccurrence_artist(timestamp_id, artist_id, id_2, id_2_type, count) VALUES ?";

      connection.query(insertCooccurencesArtist, [cooccurences], function(err) {
        if (err) {
          console.log(err);
        }
        connection.release();
      });
    });
  }
}

/**
 * Insert cooccurences for releases.
 * @param cooccurences release cooccurences
 */
function insertCooccurencesRelease(cooccurences) {
  if (cooccurences.length > 0) {
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error(err);
      }
      var insertCooccurencesRelease = "INSERT INTO cooccurrence_release(timestamp_id, release_group_id, id_2, id_2_type, count) VALUES ?";

      connection.query(insertCooccurencesRelease, [cooccurences], function(err) {
        if (err) {
          console.log(err);
        }
        connection.release();
      });
    });
  }
}

/**
 * Insert cooccurences for work.
 * @param cooccurences work cooccurences
 */
function insertCooccurencesWork(cooccurences) {
  if (cooccurences.length > 0) {
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error(err);
      }
      var insertCooccurencesWork = "INSERT INTO cooccurrence_work(timestamp_id, work_id, id_2, id_2_type, count) VALUES ?";

      connection.query(insertCooccurencesWork, [cooccurences], function(err) {
        if (err) {
          console.log(err);
        }
        connection.release();
      });
    });
  }
}

/**
 * Check if index index_frequency_artist_id for table frequency_artist exists. Create it if not.
 */
function createIndexFrequenciesArtist() {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
    }
    var checkIndexFrequenciesArtist = "SHOW INDEX FROM frequency_artist WHERE KEY_NAME = 'index_frequency_artist_id'";

    connection.query(checkIndexFrequenciesArtist, function(err, rows) {
      if (err) {
        console.log(err);
      }
      if (rows.length === 0) {
        var createIndexFrequenciesArtist = "CREATE INDEX index_frequency_artist_id ON frequency_artist(artist_id);";

        connection.query(createIndexFrequenciesArtist, function(err) {
          if (err) {
            console.log(err);
          }
          connection.release();
        })
      }
      else {
        connection.release();
      }
    });
  });
}

/**
 * Check if index index_frequency_release_group_id for table frequency_release exists. Create it if not.
 */
function createIndexFrequenciesRelease() {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
    }
    var checkIndexFrequenciesRelease = "SHOW INDEX FROM frequency_release WHERE KEY_NAME = 'index_frequency_release_group_id'";

    connection.query(checkIndexFrequenciesRelease, function(err, rows) {
      if (err) {
        console.log(err);
      }
      if (rows.length === 0) {
        var createIndexFrequenciesRelease = "CREATE INDEX index_frequency_release_group_id ON frequency_release(release_group_id);";

        connection.query(createIndexFrequenciesRelease, function(err) {
          if (err) {
            console.log(err);
          }
          connection.release();
        })
      }
      else {
        connection.release();
      }
    });
  });
}

/**
 * Check if index index_frequency_work_id for table frequency_work exists. Create it if not.
 */
function createIndexFrequenciesWork() {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
    }
    var checkIndexFrequenciesWork = "SHOW INDEX FROM frequency_work WHERE KEY_NAME = 'index_frequency_work_id'";

    connection.query(checkIndexFrequenciesWork, function(err, rows) {
      if (err) {
        console.log(err);
      }
      if (rows.length === 0) {
        var createIndexFrequenciesWork = "CREATE INDEX index_frequency_work_id ON frequency_work(work_id);";

        connection.query(createIndexFrequenciesWork, function(err) {
          if (err) {
            console.log(err);
          }
          connection.release();
        })
      }
      else {
        connection.release();
      }
    });
  });
}

/**
 * Check if index index_cooccurrences_artist_id for table cooccurrence_artist exists. Create it if not.
 */
function createIndexCooccurrencesArtist() {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
    }
    var checkIndexCooccurrencesArtist = "SHOW INDEX FROM cooccurrence_artist WHERE KEY_NAME = 'index_cooccurrences_artist_id'";

    connection.query(checkIndexCooccurrencesArtist, function(err, rows) {
      if (err) {
        console.log(err);
      }
      if (rows.length === 0) {
        var createIndexCooccurrencesArtist = "CREATE INDEX index_cooccurrences_artist_id ON cooccurrence_artist(artist_id);";

        connection.query(createIndexCooccurrencesArtist, function(err) {
          if (err) {
            console.log(err);
          }
          connection.release();
        })
      }
      else {
        connection.release();
      }
    });
  });
}

/**
 * Check if index index_cooccurrences_arelease_group_id for table cooccurrence_release exists. Create it if not.
 */
function createIndexCooccurrencesRelease() {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
    }
    var checkIndexCooccurrencesRelease = "SHOW INDEX FROM cooccurrence_release WHERE KEY_NAME = 'index_cooccurrences_arelease_group_id'";

    connection.query(checkIndexCooccurrencesRelease, function(err, rows) {
      if (err) {
        console.log(err);
      }
      if (rows.length === 0) {
        var createIndexCooccurrencesRelease = "CREATE INDEX index_cooccurrences_arelease_group_id ON cooccurrence_release(release_group_id);";

        connection.query(createIndexCooccurrencesRelease, function(err) {
          if (err) {
            console.log(err);
          }
          connection.release();
        })
      }
      else {
        connection.release();
      }
    });
  });
}

/**
 * Check if index index_cooccurrences_work_id for table cooccurrence_work exists. Create it if not.
 */
function createIndexCooccurrencesWork() {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error(err);
    }
    var checkIndexCooccurrencesWork = "SHOW INDEX FROM cooccurrence_work WHERE KEY_NAME = 'index_cooccurrences_work_id'";

    connection.query(checkIndexCooccurrencesWork, function(err, rows) {
      if (err) {
        console.log(err);
      }
      if (rows.length === 0) {
        var createIndexCooccurrencesWork = "CREATE INDEX index_cooccurrences_work_id ON cooccurrence_work(work_id);";

        connection.query(createIndexCooccurrencesWork, function(err) {
          if (err) {
            console.log(err);
          }
          connection.release();
        })
      }
      else {
        connection.release();
      }
    });
  });
}
