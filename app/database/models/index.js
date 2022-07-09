let   fs        = require('fs')
let   path      = require('path')
let   Sequelize = require('sequelize')
let   basename  = path.basename(__filename)
let   db        = {}
let   sequelize

sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './app/database/db.sqlite',
  logging: false
})

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    let model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

sequelize.sync({force: false})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = {
  Database: db.sequelize,
  Models: db.sequelize.models
}