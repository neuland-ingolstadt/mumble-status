const express = require('express')
const Gamedig = require('gamedig')

const app = express()
const port = process.env.PORT || 3000
const mumbleServer = process.env.MUMBLE_SERVER || 'voice.informatik.sexy'

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

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
