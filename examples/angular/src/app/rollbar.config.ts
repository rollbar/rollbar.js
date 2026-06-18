// src/app/rollbar.config.ts
import Rollbar from 'rollbar';

const rollbarConfig = {
  accessToken: 'ROLLBAR_POST_CLIENT_ITEM_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
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

export function createRollbar() {
  return new Rollbar(rollbarConfig);
}

