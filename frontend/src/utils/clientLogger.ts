import log, { LogLevelDesc } from 'loglevel';

const clientLogger = log;

// NOTE: みやすいログ出力のため、カスタムフォーマットを作成
const originalFactory = clientLogger.methodFactory;
clientLogger.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);
  return function (...message: any[]) {
    const timestamp = new Date().toISOString();
    rawMethod(`[${timestamp}] [${methodName.toUpperCase()}]:`, ...message);
  };
};

const logLevel: LogLevelDesc =
  (process.env.REACT_APP_LOG_LEVEL as LogLevelDesc) ||
  (process.env.NODE_ENV === 'production' ? 'warn' : 'debug');
clientLogger.setLevel(logLevel);

export default clientLogger;
