const RedisSession = require('telegraf-session-redis')

const customSession = new RedisSession({
    store: {
        host: '127.0.0.1',
        port: 6379
    }
})

module.exports = customSession
