import log from 'loglevel';

const clientLogger = log;

// NOTE: カスタムフォーマットを作成
const originalFactory = clientLogger.methodFactory;
clientLogger.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);
  return function (...message: any[]) {
    const timestamp = new Date().toISOString();
    rawMethod(`[${timestamp}] [${methodName.toUpperCase()}]:`, ...message);
  };
};

clientLogger.setLevel(process.env.NODE_ENV === 'production' ? 'warn' : 'debug');

export default clientLogger;
