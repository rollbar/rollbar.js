/**
 * Default server-side application options
 */
import {
  version,
  reportLevel,
  commonScrubFields,
  apiScrubFields,
  requestScrubFields,
  commonScrubHeaders,
} from '../defaults.js';

export const notifierName = 'node_rollbar';
export const notifierVersion = version;
export const defaultReportLevel = reportLevel;

export const scrubHeaders = commonScrubHeaders;

export const scrubFields = [
  ...commonScrubFields,
  ...apiScrubFields,
  ...requestScrubFields,
];
