import express from 'express'
import http from 'http'
import { Server } from 'socket.io';
import createGame from './public/game.js'

const game = createGame()

game.addFruit({
    fruitId: 'a', x: 2, y: 2
})
game.addFruit({
    fruitId: 'b', x: 1, y: 1
})
game.addFruit({
    fruitId: 'c', x: 2, y: 9
})   

console.log(game.state)

const app = express()
const server = http.createServer(app)
const socketio = new Server(server);

app.use(express.static('public'))

socketio.on('connection', socket => {
    const playerId = socket.id
    game.addPlayer({ playerId, x: 5, y: 5 })

    console.log(`> Player ${playerId} connected on server`)
})

server.listen(3000, () => {
    console.log('server listen to 3000')
})