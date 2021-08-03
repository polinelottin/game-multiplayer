const renderScreen = (screen, { players, fruits }, requestAnimationFrame) => {
    const context = screen.getContext('2d')
    context.clearRect(0, 0, screen.width, screen.height)

    for(const playerId in players) {
        const player = players[playerId]
        context.fillStyle = 'black'
        context.fillRect(player.x, player.y, 1, 1)
    }

    for(const fruitId in fruits) {
        const fruit = fruits[fruitId]
        context.fillStyle = 'green'
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }    
    requestAnimationFrame(() => {
        renderScreen(screen, { players, fruits }, requestAnimationFrame)
    })    
}

export default renderScreen
