const MAX_SCORE = 10

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

    const resetScore = () => {
        for (const playerId in state.players) {
            state.players[playerId].score = 0 
        }
        notifyAll({ type: 'reset-score' })
    }

    const start = () => {
        resetScore()
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

    const addPlayer = ({ playerId, x, y, admin, score}) => {
        const player = {
            x: x ? x : randomPosition(state.screen.width),
            y: y ? y : randomPosition(state.screen.height),
            admin: admin ? admin : Object.keys(state.players).length === 0,
            score: score ? score : 0
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

    const getPlayer = playerId => state.players[playerId]
    const getFruit = fruitId => state.fruits[fruitId]

    const samePosition = (obj1, obj2) => obj1.x === obj2.x && obj1.y === obj2.y

    const reachedMaxScore = playerId => {
        const player = getPlayer(playerId)
        return state.players[playerId].score === MAX_SCORE
    }

    const countScore = ({ playerId }) => {
        const player = getPlayer(playerId)
        player.score += 1 
    }

    const checkForFruitCollision = playerId => {
        const player = getPlayer(playerId)

        for (const fruitId in state.fruits) {
            const fruit = getFruit(fruitId)

            if (samePosition(player, fruit)) {
                removeFruit({ fruitId }) 
                countScore({ playerId })
            }

            if (reachedMaxScore(playerId)){
                stop()
            }
        }
    }

    const movePlayer = (command) => {
        notifyAll(command)

        const { playerId, keyPressed } = command
        const player = getPlayer(playerId)

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
        
        if (player && moves[keyPressed]) {
            moves[keyPressed](playerId)
            checkForFruitCollision(playerId)
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
        stop,
        resetScore
    }
}

export default createGame
