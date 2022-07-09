const { setupMiddlewares } = require('./middlewares')
const { setupCommands } = require('./commands')
const { setupUpdates } = require('./updates')

async function setupComponents(bot){
    setupMiddlewares(bot)
    setupCommands(bot)
    setupUpdates(bot)
}

module.exports = {
    setupComponents
}