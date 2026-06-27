const winston = require("winston");
const path = require("path");
const fs = require("fs");

const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, "combined.txt");

const logger = winston.createLogger({
  level: "info",
  format: 
  winston.format.combine(winston.format.timestamp({format:"DD-MM-YYYY - HH:mm:ss"}), 
  winston.format.printf(
    (info) => `[${info.timestamp}] : ${info.level.toUpperCase()} : ${info.message}`
  )),
  
  transports:[
    new winston.transports.File({filename:logFile})
  ]
});

module.exports = logger;