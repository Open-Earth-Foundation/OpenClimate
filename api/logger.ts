const winston = require("winston");
const { format } = winston;

// Use the environment variable for the log level
// or pick an appropriate level based on NODE_ENV

let level = process.env.OPENCLIMATE_LOG_LEVEL
  ? process.env.OPENCLIMATE_LOG_LEVEL
  : process.env.NODE_ENV === "production"
  ? "info"
  : process.env.NODE_ENV === "development"
  ? "debug"
  : process.env.NODE_ENV === "test"
  ? "crit"
  : "error";

// We have a single app-wide root logger

module.exports = winston.createLogger({
  level: level,
  transports: [new winston.transports.Console()],
  defaultMeta: { service: "OpenClimate-hub-controller" },
  format: format.combine(
    format.errors({ stack: true }),
    format.metadata(),
    format.json()
  ),
});
