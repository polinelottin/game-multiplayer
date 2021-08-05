const renderScoreTable = (scoreTable, game, currentPlayerId) => {
    let scoreTableInnerHTML = `
        <tr class="header">
            <td>Ranking</td>
        </tr>
    `

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId]

        scoreTableInnerHTML += `
            <tr ${player.playerId === currentPlayerId ? 'class="current-player"' : ''}>
                <td>${playerId}</td>
                <td>${player.points}</td>
            </tr>
        `
    }
    scoreTable.innerHTML = scoreTableInnerHTML
}

const renderCanvas = (canvas, game, currentPlayerId) => {
    const { players, fruits } = game.state

    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)

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
}

const renderScreen = (canvas, scoreTable, game, requestAnimationFrame, currentPlayerId) => {  
    renderCanvas(canvas, game, currentPlayerId)
    renderScoreTable(scoreTable, game, currentPlayerId)

    requestAnimationFrame(() => {
        renderScreen(canvas, scoreTable, game, requestAnimationFrame, currentPlayerId)
    })    
}

export default renderScreen
