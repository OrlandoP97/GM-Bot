
module.exports = {
    name: `start`,
    action: async function(ctx){
        ctx.session.counter ? ctx.session.counter : ctx.session.counter = 0
        ctx.reply(ctx.session.counter)
        ctx.scene.enter('counter')
    }
}