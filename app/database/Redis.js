const Redis = require('redis').createClient()
const { promisify } = require('util')

Redis.on('error', err => console.log(err))

const getAsync = promisify(Redis.get).bind(Redis)
const getKeyAsync = promisify(Redis.KEYS).bind(Redis)

module.exports = { Redis, getAsync, getKeyAsync }