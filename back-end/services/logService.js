const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(__dirname, '../../logs/app.log') })
  ],
});

logger.logError = (error) => {
  logger.error(error.message, {
    error: error.message,
    detail: error.stack,
    ...error
  });
};

module.exports = logger;