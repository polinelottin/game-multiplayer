const createKeyboardListener = document => {
    const state = {
        observers: [],
        playerId: null
    }

    const registerPlayerId = playerId => {
        state.playerId = playerId
    }

    const subscribe = observerFunction => {
        state.observers.push(observerFunction)
    }

    const notifyAll = command => {
        for (const observer of state.observers) {
            observer(command)
        }
    }

    const handleKeyDown = event => {
        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed: event.key
        }
        notifyAll(command)
    }

    document.addEventListener('keydown', handleKeyDown)

    return {
        subscribe,
        registerPlayerId
    }
}

export default createKeyboardListener
