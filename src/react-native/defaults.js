/**
 * Default react native options
 */
import {
  commonScrubFields,
  apiScrubFields,
  requestScrubFields,
  commonScrubHeaders,
} from '../defaults.js';

export const notifierName = 'rollbar-react-native';

export const scrubHeaders = commonScrubHeaders;

export const scrubFields = [
  ...commonScrubFields,
  ...apiScrubFields,
  ...requestScrubFields,
];

export const rewriteFilenamePatterns = [
  '^.*/[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/[^/]*.app/(.*)$',
  '^.*/[0-9A-Fa-f]{64}/codepush_ios/(.*)$',
  '^.*/[0-9A-Fa-f]{64}/codepush_android/(.*)$',
  '^.*/[0-9A-Fa-f]{64}/CodePush/(.*)$',
];
