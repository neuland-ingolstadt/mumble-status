const express = require('express')
const Gamedig = require('gamedig')
const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')

const CONNECT_REGEX = /^<[0-9]+:(.+)\([-0-9]+\)> Authenticated/
const DISCONNECT_REGEX = /<[0-9]+:(.+)\([-0-9]+\)> Connection closed/

const app = express()
const port = process.env.PORT || 3000
const mumbleServer = process.env.MUMBLE_SERVER || 'voice.informatik.sexy'
const mumbleDatabase = process.env.MUMBLE_DATABASE || './murmur.sqlite'

let db

const users = new Set()
let lastRowId = 0

async function init () {
  db = await sqlite.open({
    filename: mumbleDatabase,
    driver: sqlite3.Database,
    mode: sqlite3.OPEN_READONLY
  })
}

async function fetch () {
  const rows = await db.all('SELECT rowid, msg FROM slog WHERE rowid > ? ORDER BY msgtime ASC', [lastRowId])
  for (const { rowid, msg } of rows) {
    if (CONNECT_REGEX.test(msg)) {
      const [, name] = CONNECT_REGEX.exec(msg)
      users.add(name)
    } else if (DISCONNECT_REGEX.test(msg)) {
      const [, name] = DISCONNECT_REGEX.exec(msg)
      users.delete(name)
    }
    lastRowId = rowid
  }
}

app.get('/status.json', async (req, res) => {
  try {
    const state = await Gamedig.query({
      type: 'mumbleping',
      host: mumbleServer
    })
    res.json({
      users: state.players
    })
  } catch (e) {
    res.status(500)
  }
})

app.get('/users.json', (req, res) => {
  res.json({
    users: [...users]
  })
})

init()
  .then(() => setInterval(() => fetch().catch(console.error), 10000))
  .catch(console.error)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
