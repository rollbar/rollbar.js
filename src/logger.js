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
  /**
   * Echoes an item reported through the SDK to the console. This is what the
   * `verbose` option asks for, so unlike the other methods it is not filtered
   * by `logLevel`, which only governs the SDK's own diagnostics.
   *
   * @param {string} level - The console method to use, e.g. `'error'`.
   * @param {...*} args - The values to log.
   */
  verbose: (level, ...args) => {
    // eslint-disable-next-line no-console
    console[level]('Rollbar:', ...args);
  },
  init: ({ logLevel }) => {
    log = function (level, args) {
      if (levels[level] < levels[logLevel]) return;

      args.unshift('Rollbar:');

      // eslint-disable-next-line no-console
      console[level].apply(console, args);
    };
  },
};

export default logger;
