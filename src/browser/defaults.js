/**
 * Default browser options
 */
import { version, commonScrubFields } from '../defaults.js';

export const scrubFields = [
  ...commonScrubFields,
  'cc-number',
  'card number',
  'cardnumber',
  'cardnum',
  'ccnum',
  'ccnumber',
  'cc num',
  'creditcardnumber',
  'credit card number',
  'newcreditcardnumber',
  'new credit card',
  'creditcardno',
  'credit card no',
  'card#',
  'card #',
  'cc-csc',
  'cvc',
  'cvc2',
  'cvv2',
  'ccv2',
  'security code',
  'card verification',
  'name on credit card',
  'name on card',
  'nameoncard',
  'cardholder',
  'card holder',
  'name des karteninhabers',
  'ccname',
  'card type',
  'cardtype',
  'cc type',
  'cctype',
  'payment type',
  'expiration date',
  'expirationdate',
  'expdate',
  'cc-exp',
  'ccmonth',
  'ccyear',
];

// CDN configuration for the snippet
export const cdnHost = 'cdn.rollbar.com';
export const defaultRollbarJsUrl = `https://${cdnHost}/rollbarjs/refs/tags/v${version}/rollbar.min.js`;

export const jqueryPluginVersion = '0.0.8';

// For compatibility with existing code that expects default export with scrubFields property
export default {
  scrubFields,
};
