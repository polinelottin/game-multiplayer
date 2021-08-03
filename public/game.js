const createGame = () => {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }

    const addPlayer = ({ playerId, x, y}) => {
        state.players[playerId] = { x, y }
    }

    const removePlayer = ({ playerId }) => {
        delete state.players[playerId]
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

    const movePlayer = ({ playerId, keyPressed }) => {
        const player = state.players[playerId]

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
            checkForFruitCollision(player)
        }
    }

    return {
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        state
    }
}

export default createGame
