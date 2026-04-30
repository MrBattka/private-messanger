import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Кастомный формат вывода
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Создаём логгер
const logger = winston.createLogger({
  level: 'info', // Минимальный уровень логирования
  format: combine(
    errors({ stack: true }), // Автоматически ловит стек ошибок
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    logFormat
  ),
  transports: [
    // Логи уровня error — в отдельный файл
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),

    // Все логи — в общий файл
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),

    // В консоль (только в dev)
    ...(process.env.NODE_ENV !== 'production'
      ? [
          new winston.transports.Console({
            format: combine(colorize(), logFormat),
          }),
        ]
      : []),
  ],
});

// Создаём папку logs, если её нет
import fs from 'fs';
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

export default logger;