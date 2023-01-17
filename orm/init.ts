export {}

const { Sequelize } = require('sequelize')
const logger = require('../logger').child({module: __filename})

let sequelize = null

let connect = function () {

  if (!sequelize) {
    sequelize = new Sequelize(process.env.POSGRES_DB, process.env.POSTGRES_USER, process.env.POSGRES_PASSWORD, {
      host: process.env.POSGRES_ADDRESS,
      dialect: 'postgres',
      logging: (value) => logger.debug(value),
      omitNull: true,
    })
  }

  return sequelize
}

let disconnect = async function () {
  if (sequelize) {
    await sequelize.close()
    sequelize = null
  }
  return
}

export = {
  connect,
  disconnect
}