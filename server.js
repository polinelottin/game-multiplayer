import express from 'express'
import http from 'http'
import { Server } from 'socket.io';
import createGame from './public/game.js'

const app = express()
const server = http.createServer(app)
const socketio = new Server(server);

app.use(express.static('public'))

const game = createGame()
game.subscribe(command => {
    console.log(`> Emitting ${command.type}`)
    socketio.emit(command.type, command)
})

socketio.on('connection', socket => {
    const playerId = socket.id
    console.log(`> Player connected: ${playerId}`)

    game.addPlayer({ playerId })

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({ playerId })
        console.log(`> Player disconnected: ${playerId}`)
    })
})

server.listen(3000, () => {
    console.log('> Server listen on port: 3000')
})
