# node-service-database

## Installation

1. Install node.js
2. Run `npm install`
3. Run `node server.js`
**Commandline Options**
-p, Port for the Server (default: 2050)

Now the API is listening on the specified port or 2050 by default.

## API

### GET /query/artists

Get all artists from the database.

Returns application/json array in the following form:
```
[{
  "name": "Artist 1",
  "id": "1"
},
{
  "name": "Artist 2",
  "id": "2"
}]
```

### POST /query/artists/autocomplete/:name

Get all Artists from the database, where the name starts with the String
given with :name.

Returns application/json array in the following form:
```
[{
  "name": "Artist 1",
  "id": "1"
},
{
  "name": "Artist 2",
  "id": "2"
}]
```

### POST /insert/artists

Insert one or more artists into the database.

Takes application/json array as body in the following form:
```
[{
  "name": "Artist 1",
  "id": "1"
},
{
  "name": "Artist 2",
  "id": "2"
}]
```

When finished, the following json is send, where "rows" represents the
number of successful inserted rows:
```
{
  "rows": 2
}
```

