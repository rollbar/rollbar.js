module.exports = {
  enabled: false,
  autoStart: true,
  associateWithSpans: true,
  bufferDuration: 300000, // 5 minutes in ms
  checkoutEveryNms: 300000, // 5 minutes in ms
  blockClass: 'rr-block',
  maskTextClass: 'rr-mask',
  maskInputs: true,
  recordCanvas: false,
  inlineStylesheet: true,
  // Privacy options
  blockSelector: '', // CSS selector for elements to ignore
  maskAllInputs: false, // Mask all input values
  maskTextSelector: '' // CSS selector for text content to mask
};