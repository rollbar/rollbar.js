/**
 * Default options shared across platforms
 */
export const version = '3.0.0-beta.3';
export const endpoint = 'api.rollbar.com/api/1/item/';
export const logLevel = 'debug';
export const reportLevel = 'debug';
export const uncaughtErrorLevel = 'error';
export const maxItems = 0;
export const itemsPerMin = 60;

export const commonScrubFields = [
  'pw',
  'pass',
  'passwd',
  'password',
  'secret',
  'confirm_password',
  'confirmPassword',
  'password_confirmation',
  'passwordConfirmation',
  'access_token',
  'accessToken',
  'X-Rollbar-Access-Token',
  'secret_key',
  'secretKey',
  'secretToken',
];

export const apiScrubFields = [
  'api_key',
  'authenticity_token',
  'oauth_token',
  'token',
  'user_session_secret',
];

export const requestScrubFields = [
  'request.session.csrf',
  'request.session._csrf',
  'request.params._csrf',
  'request.cookie',
  'request.cookies',
];

export const commonScrubHeaders = [
  'authorization',
  'www-authorization',
  'http_authorization',
  'omniauth.auth',
  'cookie',
  'oauth-access-token',
  'x-access-token',
  'x_csrf_token',
  'http_x_csrf_token',
  'x-csrf-token',
];

// For backward compatibility with default export
export default {
  version,
  endpoint,
  logLevel,
  reportLevel,
  uncaughtErrorLevel,
  maxItems,
  itemsPerMin,
};
