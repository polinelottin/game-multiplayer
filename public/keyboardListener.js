const createKeyboardListener = document => {
    const startButton = document.getElementById('start')
    const stopButton = document.getElementById('stop')

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

    const handleStart = () => {
        const command = {
            type: 'start-game',
        }
        notifyAll(command);

        startButton.disabled = true
        stopButton.disabled = false
    }

    const handleStop = () => {
        const command = {
            type: 'stop-game',
        }
        notifyAll(command);

        startButton.disabled = false
        stopButton.disabled = true
    }

    startButton.addEventListener('click', handleStart)
    stopButton.addEventListener('click', handleStop)
    document.addEventListener('keydown', handleKeyDown)

    return {
        subscribe,
        registerPlayerId
    }
}

export default createKeyboardListener
