// src/app/rollbar.config.ts
import Rollbar from 'rollbar';

const rollbarConfig: Rollbar.Configuration = {
  accessToken: 'ROLLBAR_POST_CLIENT_ITEM_TOKEN',
  // Uncaught errors and unhandled rejections reach Rollbar through
  // `provideBrowserGlobalErrorListeners()` and `RollbarErrorHandler` instead
  // (see app.config.ts). That also covers errors thrown before this lazily
  // loaded module has run, and turning these on too would report each
  // error twice.
  captureUncaught: false,
  captureUnhandledRejections: false,
  environment: 'production',
  payload: {
    client: {
      javascript: {
        source_map_enabled: true,
        code_version: '1.0.0',
      },
    },
  },
};

export function createRollbar(): Rollbar {
  return new Rollbar(rollbarConfig);
}
