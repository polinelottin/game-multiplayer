const renderScreen = (screen, game, requestAnimationFrame, currentPlayerId) => {
    const { players, fruits } = game.state

    const context = screen.getContext('2d')
    context.clearRect(0, 0, screen.width, screen.height)

    for(const playerId in players) {
        const player = players[playerId]
        context.fillStyle = playerId === currentPlayerId ? 'pink' : 'black'
        context.fillRect(player.x, player.y, 1, 1)
    }

    for(const fruitId in fruits) {
        const fruit = fruits[fruitId]
        context.fillStyle = 'green'
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }    
    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
    })    
}

export default renderScreen
