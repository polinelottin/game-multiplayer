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

    const addPlayer = ({ playerId, x, y}) => {
        const player = {
            x: x ? x : randomPosition(state.screen.width),
            y: y ? y : randomPosition(state.screen.height)
        }
        state.players[playerId] = player

        notifyAll({
            type: 'add-player',
            playerId,
            x: player.x,
            y: player.y
        })
    }

    const removePlayer = ({ playerId }) => {
        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId
        })
    }

    const addFruit = ({ fruitId, x, y}) => {
        state.fruits[fruitId] = { x, y }
    }

    const removeFruit = ({ fruitId }) => {
        delete state.fruits[fruitId]
    }

    const checkForFruitCollision = player => {
        for (const fruitId in state.fruits) {
            const { x, y } = state.fruits[fruitId]

            if (x === player.x && y === player.y) {
                removeFruit({ fruitId }) 
            }
        }
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
            checkForFruitCollision(player)
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
        setState
    }
}

export default createGame
