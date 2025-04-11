/**
 * Default options for the rrweb recorder
 * See https://github.com/rrweb-io/rrweb/blob/master/guide.md#options for details
 */
module.exports = {
  // Rollbar-specific configuration
  enabled: false,                 // Whether recording is enabled
  autoStart: true,                // Start recording automatically when Rollbar initializes
  associateWithSpans: true,       // Associate recording events with OpenTelemetry spans
  bufferDuration: 300000,         // How far back to keep recordings (5 minutes in ms)

  // rrweb configuration options
  
  // Snapshot options
  checkoutEveryNth: undefined,    // Take a full snapshot after every N events
  checkoutEveryNms: 300000,       // Take a full snapshot after N milliseconds (5 minutes)
  
  // Privacy configuration - Elements
  blockClass: 'rr-block',         // Class name for elements that should be blocked from recording
  blockSelector: '',              // CSS selector for elements that should be blocked from recording
  ignoreClass: 'rr-ignore',       // Class name for elements that should be completely ignored
  ignoreSelector: '',             // CSS selector for elements that should be completely ignored
  
  // Privacy configuration - Text
  maskTextClass: 'rr-mask',       // Class name for elements whose text content should be masked
  maskTextSelector: '',           // CSS selector for elements whose text content should be masked
  
  // Privacy configuration - Inputs
  maskInputs: true,               // Applies default masking to input values
  maskAllInputs: false,           // Mask all input values regardless of type
  maskInputOptions: {             // Fine-grained control over which input types to mask
    // By default only password inputs are masked if maskInputs is true
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
    week: false
  },
  
  // Performance options
  inlineStylesheet: true,         // Whether to inline stylesheets to improve replay accuracy
  recordCanvas: false,            // Whether to record canvas content (can greatly increase size)
  recordCrossOriginIframes: false, // Whether to record cross-origin iframes (requires special setup)
  recordAfter: 'load',            // Record after (options: 'load', 'DOMContentLoaded', or any other event)
  
  // CSS configuration
  ignoreCSSAttributes: [],        // CSS attributes to ignore when recording

  // Advanced configuration
  slimDOMOptions: {               // Options to minimize the size of DOM snapshots
    script: true,                 // Remove script elements
    comment: true,                // Remove comments
    headFavicon: true,            // Remove favicons in the head
    headWhitespace: true,         // Remove whitespace in head
    headMetaDescKeywords: true,   // Remove meta description and keywords
    headMetaSocial: true,         // Remove social media meta tags
    headMetaRobots: true,         // Remove robots meta directives
    headMetaHttpEquiv: true,      // Remove http-equiv meta directives
    headMetaAuthorship: true,     // Remove authorship meta directives
    headMetaVerification: true    // Remove verification meta directives
  },
  
  // Custom callbacks for advanced use cases
  // These are undefined by default and can be set programmatically
  // maskInputFn: undefined,      // Custom function to mask input values
  // maskTextFn: undefined,       // Custom function to mask text content
  // errorHandler: undefined,     // Custom error handler for recording errors
  
  // Plugin system
  // plugins: []                  // List of plugins to use (must be set programmatically)
};