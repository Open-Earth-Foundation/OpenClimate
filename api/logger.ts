const winston = require('winston')

// We have a single app-wide root logger

let level = (process.env.NODE_ENV === "production") ? "info" :
    (process.env.NODE_ENV === "development") ? "debug" :
    (process.env.NODE_ENV === "test") ? "crit" : "error";

module.exports = winston.createLogger({
    level: level,
    transports: [
        new winston.transports.Console()
    ],
    defaultMeta: { service: 'OpenClimate-hub-controller' },
    format: winston.format.json()
})