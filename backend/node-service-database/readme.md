# node-service-database

## Installation

1. Install [VirtualBox](https://www.virtualbox.org/)
2. Install the [Musicbrainz VM](https://musicbrainz.org/doc/MusicBrainz_Server/Setup)
3. In the network section of the Musicbrainz VM settings add a port mapping
rule with protocol: TCP, Host-IP: 127.0.0.1, Host-Port: 8888 and Guest-Port: 5432
4. Start the Musicbrainz VM
5. In the VM uncomment and change `listen_addresses = '*'` in
`/etc/postgresql/*/main/postgresql.conf` and add
`host all all 10.0.2.2/24 trust` to `/etc/postgresql/*/main/pg_hba.conf`
6. Restart Postgresql with `sudo /etc/init.d/postgresql restart`
7. Install [node.js](https://nodejs.org)
8. Run `npm install`
9. Run `node server.js`
**Commandline Options**
-p, Port for the Server (default: 2050)

Now the API is listening on the specified port or 2050 by default.

## API

### GET /query/artists

Get all artists from the database.

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

### GET /query/artists/autocomplete/:name

Get all artists from the database, where the name starts with the String
given with :name.

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

### GET /query/labels

Get all labels from the database.

### GET /query/labels/autocomplete/:name

Get all labels from the database, where the name starts with the String
given with :name.
