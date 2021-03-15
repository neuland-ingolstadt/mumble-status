# mumble-status

Exposes the Mumble user count and user list as a REST API.

The user count is retrieved with a ping and the user list is parsed from the database.

## Configuration

Set the following environment variables:

* `PORT=3000`
* `MUMBLE_SERVER=voice.informatik.sexy`
* `MUMBLE_DATABASE=/opt/murmur/murmur.sqlite`

## API

### GET /status.json

Response:
```
{ "users": 4 }
```

### GET /users.json

Response:
```
{ "users": ["maxmustermann", "mariamusterfrau"] }
```
