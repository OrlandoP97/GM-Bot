const { Scenes } = require('telegraf')
const { BaseScene } = Scenes


const scene = new BaseScene('counter')

scene.enter( async ctx => {
    ctx.session.counter ? ctx.session.counter++ : ctx.session.counter=1
})

scene.command('exit', async ctx => {
    ctx.reply(ctx.session.counter)
})

module.exports = scene