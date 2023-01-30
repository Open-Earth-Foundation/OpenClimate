require('dotenv').config()
const http = require('http')
const url = require('url')
import {app} from './app'

let server = http.createServer(app)

module.exports.server = server

// Websockets required to make APIs work and avoid circular dependency
let websocket = require('./websockets')
let anonWebSocket = require('./anonwebsockets')

// We use one Winston instance for the entire app

const logger = require('./logger').child({module: __filename})

server.on('upgrade', function upgrade(request, socket, head) {
  logger.debug('upgrade')
  const pathname = url.parse(request.url).pathname

  if (pathname === '/api/admin/ws') {
    websocket.getWS().handleUpgrade(request, socket, head, function done(ws) {
      ws.type = 'admin'
      websocket.getWS().emit('connection', ws, request)
    })
  } else if (pathname === '/api/anon/ws') {
    anonWebSocket.getWS().handleUpgrade(request, socket, head, function done(ws) {
      ws.type = 'anon'
      anonWebSocket.getWS().emit('connection', ws, request)
    })
  } else {
    socket.destroy()
  }
})

anonWebSocket.start()
websocket.start()

server.listen(process.env.CONTROLLERPORT || 3100, () =>
  logger.info(
    `Server listening at http://localhost:${
      process.env.CONTROLLERPORT || 3100
    }`,
    `\n Agent Address: ${process.env.AGENTADDRESS || 'localhost:8150'}`,
  ),
)
