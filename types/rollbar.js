/**
 * Type-only Rollbar surface for declaration generation.
 * Mirrors index.d.ts using JSDoc for tsd-jsdoc.
 */

/** @typedef {Object<string, any>} RollbarDictionary */
/** @typedef {Object<string, string>} RollbarStringAttributes */
/** @typedef {'debug'|'info'|'warning'|'error'|'critical'} RollbarLevel */

/**
 * @callback RollbarCallback
 * @param {Error|undefined|null} err
 * @param {any} response
 */

/** @typedef {Error|undefined|null} RollbarMaybeError */

/**
 * @callback RollbarTelemetryScrubber
 * @param {RollbarTelemetryScrubberInput} description
 * @returns {boolean}
 */

/**
 * @typedef {object} RollbarDomAttribute
 * @property {'type'|'name'|'title'|'alt'} key
 * @property {string} value
 */

/**
 * @typedef {object} RollbarDomDescription
 * @property {string} tagName
 * @property {string|undefined} id
 * @property {Array<string>|undefined} classes
 * @property {Array<RollbarDomAttribute>} attributes
 */

/** @typedef {RollbarDomDescription|null} RollbarTelemetryScrubberInput */

/**
 * @typedef {object} RollbarAutoInstrumentSettings
 * @property {boolean} [network]
 * @property {boolean|Array<string>} [networkResponseHeaders]
 * @property {boolean} [networkResponseBody]
 * @property {boolean} [networkRequestBody]
 * @property {boolean} [log]
 * @property {boolean} [dom]
 * @property {boolean} [navigation]
 * @property {boolean} [connectivity]
 * @property {boolean} [contentSecurityPolicy]
 * @property {boolean} [errorOnContentSecurityPolicy]
 */

/** @typedef {boolean|RollbarAutoInstrumentSettings} RollbarAutoInstrumentOptions */

/**
 * @typedef {object} RollbarPerson
 * @property {string|number|null} id
 * @property {string} [username]
 * @property {string} [email]
 * @property {any} [property]
 */

/**
 * @typedef {object} RollbarClientJavascript
 * @property {string|number} [code_version]
 * @property {boolean} [source_map_enabled]
 * @property {boolean} [guess_uncaught_frames]
 * @property {any} [property]
 */

/**
 * @typedef {object} RollbarClientPayload
 * @property {RollbarClientJavascript} [javascript]
 * @property {any} [property]
 */

/**
 * @typedef {object} RollbarServerPayload
 * @property {string} [branch]
 * @property {string} [host]
 * @property {string} [root]
 * @property {any} [property]
 */

/**
 * @typedef {object} RollbarPayload
 * @property {RollbarPerson} [person]
 * @property {any} [context]
 * @property {RollbarClientPayload} [client]
 * @property {string} [environment]
 * @property {RollbarServerPayload} [server]
 * @property {any} [property]
 */

/**
 * @typedef {object} RollbarReplayTriggerDefaults
 * @property {number} [samplingRatio]
 * @property {number} [preDuration]
 * @property {number} [postDuration]
 */

/**
 * @typedef {object} RollbarReplayTrigger
 * @property {string} type
 * @property {number} [samplingRatio]
 * @property {number} [preDuration]
 * @property {number} [postDuration]
 * @property {function(RollbarDictionary, RollbarDictionary): boolean} [predicateFn]
 * @property {Array<RollbarLevel>} [level]
 * @property {string|RegExp} [pathMatch]
 * @property {Array<string>} [tags]
 */

/**
 * @typedef {object} RollbarReplayDebug
 * @property {boolean} [logErrors]
 * @property {boolean} [logEmits]
 */

/**
 * @typedef {object} RollbarReplaySlimDOM
 * @property {boolean} [script]
 * @property {boolean} [comment]
 * @property {boolean} [headFavicon]
 * @property {boolean} [headWhitespace]
 * @property {boolean} [headMetaDescKeywords]
 * @property {boolean} [headMetaSocial]
 * @property {boolean} [headMetaRobots]
 * @property {boolean} [headMetaHttpEquiv]
 * @property {boolean} [headMetaAuthorship]
 * @property {boolean} [headMetaVerification]
 */

/**
 * @typedef {object} RollbarReplayOptions
 * @property {boolean} [enabled]
 * @property {boolean} [autoStart]
 * @property {RollbarReplayTriggerDefaults} [triggerDefaults]
 * @property {Array<RollbarReplayTrigger>} [triggers]
 * @property {RollbarReplayDebug} [debug]
 * @property {boolean} [inlineStylesheet]
 * @property {boolean} [inlineImages]
 * @property {boolean} [collectFonts]
 * @property {Object<string, boolean>} [maskInputOptions]
 * @property {string} [blockClass]
 * @property {string} [maskTextClass]
 * @property {string} [ignoreClass]
 * @property {RollbarReplaySlimDOM} [slimDOMOptions]
 * @property {function(string): string} [maskInputFn]
 * @property {function(string): string} [maskTextFn]
 * @property {function(Error): void} [errorHandler]
 * @property {Array<any>} [plugins]
 */

/**
 * @typedef {object} RollbarTransformSpanParams
 * @property {any} span
 */

/**
 * @typedef {object} RollbarTracingOptions
 * @property {boolean} [enabled]
 * @property {string} [endpoint]
 * @property {function(RollbarTransformSpanParams): void} [transformSpan]
 */

/**
 * @typedef {object} RollbarLocalsSettings
 * @property {any} module
 * @property {boolean} [enabled]
 * @property {boolean} [uncaughtOnly]
 * @property {number} [depth]
 * @property {number} [maxProperties]
 * @property {number} [maxArray]
 */

/** @typedef {RollbarLocalsSettings|Function} RollbarLocalsOptions */

/**
 * @typedef {object} RollbarConfiguration
 * @property {string} [accessToken]
 * @property {boolean} [addErrorContext]
 * @property {function(RollbarDictionary, RollbarDictionary): void} [addRequestData]
 * @property {RollbarAutoInstrumentOptions} [autoInstrument]
 * @property {boolean} [captureDeviceInfo]
 * @property {boolean} [captureEmail]
 * @property {boolean|'anonymize'} [captureIp]
 * @property {boolean} [captureLambdaTimeouts]
 * @property {boolean} [captureUncaught]
 * @property {boolean} [captureUnhandledRejections]
 * @property {boolean} [captureUsername]
 * @property {function(boolean, Array<RollbarLogArgument>, RollbarDictionary): boolean} [checkIgnore]
 * @property {string} [codeVersion]
 * @property {string} [code_version]
 * @property {boolean} [enabled]
 * @property {string} [endpoint]
 * @property {boolean} [exitOnUncaughtException]
 * @property {string} [environment]
 * @property {function(RollbarTelemetryEvent): boolean} [filterTelemetry]
 * @property {string} [host]
 * @property {Array<string>} [hostBlackList]
 * @property {Array<string>} [hostBlockList]
 * @property {Array<string>} [hostWhiteList]
 * @property {Array<string>} [hostSafeList]
 * @property {Array<string|RegExp>} [ignoredMessages]
 * @property {boolean} [ignoreDuplicateErrors]
 * @property {boolean} [includeItemsInTelemetry]
 * @property {boolean} [inspectAnonymousErrors]
 * @property {number} [itemsPerMinute]
 * @property {RollbarLocalsOptions} [locals]
 * @property {RollbarLevel} [logLevel]
 * @property {number} [maxItems]
 * @property {number} [maxRetries]
 * @property {number} [maxTelemetryEvents]
 * @property {boolean} [nodeSourceMaps]
 * @property {function(boolean, Array<RollbarLogArgument>, RollbarDictionary): void} [onSendCallback]
 * @property {boolean} [overwriteScrubFields]
 * @property {RollbarPayload} [payload]
 * @property {RollbarReplayOptions} [replay]
 * @property {RollbarLevel} [reportLevel]
 * @property {RollbarStringAttributes} [resource]
 * @property {number|null} [retryInterval]
 * @property {Array<string>} [rewriteFilenamePatterns]
 * @property {Array<string>} [scrubFields]
 * @property {Array<string>} [scrubHeaders]
 * @property {Array<string>} [scrubPaths]
 * @property {boolean} [scrubRequestBody]
 * @property {boolean} [scrubTelemetryInputs]
 * @property {boolean} [sendConfig]
 * @property {number} [stackTraceLimit]
 * @property {RollbarTelemetryScrubber} [telemetryScrubber]
 * @property {number} [timeout]
 * @property {RollbarTracingOptions} [tracing]
 * @property {function(RollbarDictionary, RollbarDictionary): (void|Promise<void>)} [transform]
 * @property {boolean} [transmit]
 * @property {RollbarLevel} [uncaughtErrorLevel]
 * @property {boolean} [verbose]
 * @property {string} [version]
 * @property {boolean} [wrapGlobalEventHandlers]
 */

/**
 * @typedef {object} RollbarLogResult
 * @property {string} uuid
 */

/**
 * @typedef {object} RollbarTelemetryEvent
 * @property {RollbarLevel} level
 * @property {string} type
 * @property {number} timestamp_ms
 * @property {RollbarDictionary} body
 * @property {string} source
 * @property {string} [uuid]
 */

/**
 * @typedef {object} RollbarComponents
 * @property {Function} [telemeter]
 * @property {Function} [instrumenter]
 * @property {Function} [wrapGlobals]
 * @property {Function} [scrub]
 * @property {Function} [truncation]
 * @property {Function} [tracing]
 * @property {Function} [replay]
 */

/**
 * @class Rollbar
 */
class Rollbar {
  /** @param {RollbarConfiguration} [options] */
  constructor(options) {}
  /** @param {RollbarConfiguration} options */
  static init(options) {}
  /** @param {RollbarComponents} components */
  static setComponents(components) {}
  /** @param {RollbarConfiguration} options */
  global(options) {}
  /** @param {RollbarConfiguration} options */
  configure(options) {}
  /** @returns {RollbarMaybeError} */
  lastError() {}
  /** @returns {RollbarLogResult} */
  log() {}
  /** @returns {RollbarLogResult} */
  debug() {}
  /** @returns {RollbarLogResult} */
  info() {}
  /** @returns {RollbarLogResult} */
  warn() {}
  /** @returns {RollbarLogResult} */
  warning() {}
  /** @returns {RollbarLogResult} */
  error() {}
  /** @returns {RollbarLogResult} */
  critical() {}
  /** @param {Function} callback */
  wait(callback) {}
  /** @param {RollbarDictionary} context */
  triggerDirectReplay(context) {}
  /** @param {object} metadata @param {RollbarLevel} level */
  captureEvent(metadata, level) {}
  /** @param {Function} handler */
  lambdaHandler(handler) {}
  /** @returns {Function} */
  errorHandler() {}
  /** @type {Rollbar} */
  rollbar;
  /** @type {RollbarConfiguration} */
  options;
}

export default Rollbar;
