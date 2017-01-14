# node-service-database

## Installation

1. Install [node.js](https://nodejs.org)
2. Run `npm install`
3. Run `node server.js`
**Commandline Options**
-p, Port for the Server (default: 2050)

Now the API is listening on the specified port or 2050 by default.

## API

### GET /query/artists/:offset

Get all artists from the database from a given offset with default limit
ordered by name ascending.

Returns application/json array in the following form:
```
[{
  "id": "1",
  "name": "Artist 1"
},
{
  "id": "2",
  "name": "Artist 2"
}]
```

### POST /query/artists/autocomplete/name

Get all artists from the database, where the name starts with the String
given in the request body.

Takes a json body in the follwing form:
```
{
  "name": "Artist"
}
```

Returns application/json array in the following form:
```
[{
  "id": "1",
  "name": "Artist 1"
},
{
  "id": "2",
  "name": "Artist 2"
}]
```

### GET /query/labels/:offset

Get all labels from the database from a given offset with default limit
ordered by name ascending.

Returns application/json array in the following form:
```
[{
  "id": "1",
  "name": "Label 1"
},
{
  "id": "2",
  "name": "Label 2"
}]
```

### POST /query/labels/autocomplete/name

Get all labels from the database, where the name starts with the String
given in the request body.

Takes a json body in the follwing form:
```
{
  "name": "Label"
}
```

Returns application/json array in the following form:
```
[{
  "id": "1",
  "name": "Label 1"
},
{
  "id": "2",
  "name": "Label 2"
}]
```

### GET /query/artist/labels/:id

Get all labels where a artist, represented by its id, has published music.

Returns application/json array in the following form:
```
[{
  "id": "1",
  "name": "Label 1"
},
{
  "id": "2",
  "name": "Label 2"
}]
```

### GET /query/artist/albums/:id

Get all releases released by a given artists represented by its id.

Returns application/json array in the following form:
```
[{
  "id": 1,
  "name": "Release 1"
},
{
  "id": 2,
  "name": "Release 2"
}]
```

### GET /query/release/track/:id

Get all tracks for a given release represented by its id.

Returns application/json array in the following form:
```
[{
  "id": 1,
  "name": "Track 1",
  "number": 1,
  "length": "1:25"
},
{
  "id": 2,
  "name": "Track 2",
  "number": 1,
  "length": "2:55"
}]
```

### POST /insert/twitter

Insert Twitter data into the database.Insert Twitter data into the database.
