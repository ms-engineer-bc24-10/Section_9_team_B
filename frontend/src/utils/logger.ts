import winston from 'winston';
import path from 'path';

// ログのカラー設定
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// ログのフォーマット設定
const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.colorize({ all: true }),
  winston.format.json(),
);

// トランスポート設定
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: path.join(__dirname, 'logs', 'error.log'),
    level: 'error',
  }),
  new winston.transports.File({
    filename: path.join(__dirname, 'logs', 'all.log'),
  }),
];

// ロガー作成
const logger = winston.createLogger({
  format,
  transports,
});

export default logger;
