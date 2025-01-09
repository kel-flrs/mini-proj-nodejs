import { createLogger, format, transports } from 'winston';
import dotenv from 'dotenv';
dotenv.config();

const { combine, timestamp, printf, colorize, errors } = format;

// Custom format: include timestamp, level, message, and stack (if error)
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return stack
    ? `[${timestamp}] ${level}: ${message}\n${stack}`
    : `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',  // e.g., 'debug', 'info', 'warn', 'error'
  format: combine(
    errors({ stack: true }), // capture stack trace for error logs
    timestamp(),
    colorize(),
    logFormat
  ),
  transports: [
    new transports.Console(),
  ],
});

export default logger;
