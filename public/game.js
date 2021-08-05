const createGame = () => {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }
    const observers = []
    const runtime = {}

    const start = () => {
        runtime.addFruits = setInterval(addFruit, 2000)
    }

    const stop = () => {
        clearInterval(runtime.addFruits);
        removeAllFruits()
    }

    const setState = newState => {
        Object.assign(state, newState)
    }

    const subscribe = observerFunction => {
        observers.push(observerFunction)
    }

    const notifyAll = command => {
        for (const observer of observers) {
            observer(command)
        }
    }

    const randomPosition = max => Math.floor(Math.random() * max)

    const addPlayer = ({ playerId, x, y, admin, points}) => {
        const player = {
            x: x ? x : randomPosition(state.screen.width),
            y: y ? y : randomPosition(state.screen.height),
            admin: admin ? admin : Object.keys(state.players).length === 0,
            points: points ? points : 0
        }
        state.players[playerId] = player

        notifyAll({
            type: 'add-player',
            playerId,
            ...player
        })
    }

    const removePlayer = ({ playerId }) => {
        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId
        })

        if (Object.keys(state.players).length === 0) {
            stop()
        }
    }

    const addFruit = (command = {}) => {
        const fruitId = command.fruitId ? command.fruitId : randomPosition(1000000)
        const fruit = {
            x: command.x ? command.x : randomPosition(state.screen.width),
            y: command.y ? command.y : randomPosition(state.screen.height)
        }

        state.fruits[fruitId] = fruit

        notifyAll({
            type: 'add-fruit',
            fruitId,
            x: fruit.x,
            y: fruit.y
        })
    }

    const removeAllFruits = () => {
        for (const fruitId in state.fruits) {
            removeFruit({ fruitId })
        }
    }

    const removeFruit = ({ fruitId }) => {
        delete state.fruits[fruitId]

        notifyAll({
            type: 'remove-fruit',
            fruitId
        })
    }

    const checkForFruitCollision = playerId => {
        const player = state.players[playerId]

        for (const fruitId in state.fruits) {
            const { x, y } = state.fruits[fruitId]

            if (x === player.x && y === player.y) {
                state.players[playerId].points += 1 
                removeFruit({ fruitId }) 
            }
        }

        console.log(`Points: ${state.players[playerId].points}`)
    }

    const movePlayer = (command) => {
        notifyAll(command)

        const player = state.players[command.playerId]

        const moves = {
            'ArrowLeft': () => {
                player.x = Math.max(player.x - 1, 0)
            },
            'ArrowRight': () => {
                player.x = Math.min(player.x + 1, state.screen.width - 1)
            },
            'ArrowDown': () => {
                player.y = Math.min(player.y + 1, state.screen.height - 1) 
            },
            'ArrowUp': () => {
                player.y = Math.max(player.y - 1, 0)
            }
        }
        
        if (player && moves[command.keyPressed]) {
            moves[command.keyPressed](command.playerId)
            checkForFruitCollision(command.playerId)
        }
    }

    return {
        state,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        subscribe,
        setState,
        start,
        stop
    }
}

export default createGame
