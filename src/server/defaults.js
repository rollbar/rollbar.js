/**
 * Default server-side application options
 */
import {
  commonScrubFields,
  apiScrubFields,
  requestScrubFields,
  commonScrubHeaders,
} from '../defaults.js';

export const notifierName = 'node_rollbar';

export const scrubHeaders = commonScrubHeaders;

export const scrubFields = [
  ...commonScrubFields,
  ...apiScrubFields,
  ...requestScrubFields,
];
