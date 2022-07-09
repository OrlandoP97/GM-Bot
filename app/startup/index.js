const { Telegraf } = require('telegraf')
const { setupComponents } = require('../components')

const TOKEN = `5227363417:AAFanTQQeMOQF8iKCFpYJdtn8SjjNyqcJh8`
const bot = new Telegraf(TOKEN)

async function run(){
    try {
        await setupComponents(bot)
        await bot.launch()
        console.info('Bot is up and running...')
    } catch(err) {
        console.log(err)
    }
}


run()