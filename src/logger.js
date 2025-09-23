let log = () => {};

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  disable: 4,
};

const logger = {
  error: (...args) => log('error', args),
  warn: (...args) => log('warn', args),
  info: (...args) => log('info', args),
  debug: (...args) => log('debug', args),
  log: (...args) => log('info', args),
  init: ({ logLevel }) => {
    log = function(level, args) {
      if (levels[level] < levels[logLevel]) return;

      args.unshift('Rollbar:');

      /* eslint-disable no-console */
      console[level].apply(console, args);
    }
  }
};

export default logger;
