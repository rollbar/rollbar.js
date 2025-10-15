/**
 * Default session replay recording options
 * See https://github.com/rrweb-io/rrweb/blob/master/guide.md#options for details
 */
export default {
  enabled: false, // Whether recording is enabled
  autoStart: true, // Start recording automatically when Rollbar initializes

  // defaults used by triggers that don't specify them
  triggerDefaults: {
    samplingRatio: 1.0,
    preDuration: 300,
    postDuration: 5,
  },
  triggers: [
    {
      type: 'occurrence',
      level: ['error', 'critical'],
    },
  ],

  debug: {
    logErrors: true, // Whether to log errors emitted by rrweb.
    logEmits: false, // Whether to log emitted events
  },

  // Recording options
  inlineStylesheet: true, // Whether to inline stylesheets to improve replay accuracy
  inlineImages: false, // Whether to record the image content
  collectFonts: true, // Whether to collect fonts in the website

  // Privacy options
  // Fine-grained control over which input types to mask
  // By default only password inputs are masked if maskInputs is true
  maskInputOptions: {
    password: true,
    email: false,
    tel: false,
    text: false,
    color: false,
    date: false,
    'datetime-local': false,
    month: false,
    number: false,
    range: false,
    search: false,
    time: false,
    url: false,
    week: false,
  },

  // Mask all input values
  maskAllInputs: false,

  // Class names to block, mask, or ignore the content of elements.
  blockClass: 'rb-block',
  maskTextClass: 'rb-mask',
  ignoreClass: 'rb-ignore',

  // Remove unnecessary parts of the DOM
  // By default all removable elements are removed
  slimDOMOptions: {
    script: true, // Remove script elements
    comment: true, // Remove comments
    headFavicon: true, // Remove favicons in the head
    headWhitespace: true, // Remove whitespace in head
    headMetaDescKeywords: true, // Remove meta description and keywords
    headMetaSocial: true, // Remove social media meta tags
    headMetaRobots: true, // Remove robots meta directives
    headMetaHttpEquiv: true, // Remove http-equiv meta directives
    headMetaAuthorship: true, // Remove authorship meta directives
    headMetaVerification: true, // Remove verification meta directives
  },

  // Custom callbacks for advanced use cases
  // These are undefined by default and can be set programmatically
  // maskInputFn: undefined,      // Custom function to mask input values
  // maskTextFn: undefined,       // Custom function to mask text content
  // errorHandler: undefined,     // Custom error handler for recording errors

  // Plugin system
  // plugins: []                  // List of plugins to use (must be set programmatically)
};
