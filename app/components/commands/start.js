
module.exports = {
    name: `start`,
    action: async function(ctx){
        ctx.scene.enter('counter')
    }
}