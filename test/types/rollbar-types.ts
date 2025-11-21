// Type-level checks to keep index.d.ts honest. These are not executed.
import Rollbar from 'rollbar';

const rb = new Rollbar({
  accessToken: 'POST_SERVER_ITEM_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  autoInstrument: false,
});

// Basic logging API
const logResult = rb.error('oops');
logResult as Rollbar.LogResult;

// Telemetry event capture returns the declared TelemetryEvent type
const telemetry = rb.captureEvent({ foo: 'bar' }, 'info');
telemetry as Rollbar.TelemetryEvent;

// Lambda handler wrapper preserves generic types
const lambda = rb.lambdaHandler<{ foo: string }>(async (event) => {
  return { ok: Boolean(event.foo) };
});

// Trigger replay API should accept a Dictionary
rb.triggerDirectReplay({ context: 'unit-test' } satisfies Rollbar.Dictionary);

// Prevent unused variable lint noise while keeping type assertions
void logResult;
void telemetry;
void lambda;

// Configuration object should satisfy the declared shape
const cfg: Rollbar.Configuration = {
  accessToken: 'CLIENT_TOKEN',
  captureEmail: true,
  captureIp: 'anonymize',
  captureUsername: true,
  payload: {
    person: { id: '123', email: 'user@example.com' },
    context: 'checkout-flow',
    client: {
      javascript: {
        code_version: 'abc123',
        source_map_enabled: true,
        guess_uncaught_frames: false,
        extraClientInfo: true,
      },
      clientMeta: true,
    },
    environment: 'production',
    server: {
      branch: 'main',
      host: 'web-01',
      root: '/var/www/app',
      extraServerInfo: true,
    },
    extraPayload: true,
  },
  autoInstrument: {
    network: true,
    networkResponseHeaders: ['content-type'],
    networkResponseBody: true,
    networkRequestBody: true,
    log: true,
    dom: true,
    navigation: true,
    connectivity: true,
    contentSecurityPolicy: true,
    errorOnContentSecurityPolicy: true,
  },
  captureDeviceInfo: true,
  captureLambdaTimeouts: false,
  captureUncaught: true,
  captureUnhandledRejections: true,
  addErrorContext: true,
  addRequestData: (data, req) => {
    data.req = req;
  },
  checkIgnore: (_isUncaught, args, item) => {
    void args;
    void item;
    return false;
  },
  codeVersion: '1.2.3',
  code_version: 'legacy',
  enabled: true,
  endpoint: 'https://api.rollbar.com/api/1/item',
  exitOnUncaughtException: false,
  environment: 'production',
  filterTelemetry: (e) => e.level !== 'debug',
  host: 'localhost',
  hostBlockList: ['blocked.example.com'],
  hostSafeList: ['safe.example.com'],
  ignoredMessages: [/ignore me/],
  ignoreDuplicateErrors: true,
  includeItemsInTelemetry: true,
  inspectAnonymousErrors: true,
  itemsPerMinute: 60,
  locals: {
    module: Object,
    enabled: true,
    uncaughtOnly: false,
    depth: 5,
    maxProperties: 20,
    maxArray: 50,
  },
  logLevel: 'error',
  maxItems: 1000,
  maxRetries: 3,
  maxTelemetryEvents: 100,
  nodeSourceMaps: true,
  onSendCallback: (_isUncaught, _args, _item) => {},
  overwriteScrubFields: false,
  replay: {
    enabled: true,
    autoStart: true,
    triggerDefaults: { samplingRatio: 1, preDuration: 1, postDuration: 2 },
    triggers: [
      {
        type: 'error',
        samplingRatio: 0.5,
        preDuration: 1,
        postDuration: 1,
        predicateFn: (trigger, context) => {
          void trigger;
          void context;
          return true;
        },
        level: ['error', 'critical'],
        pathMatch: /checkout/,
        tags: ['tag1'],
      },
    ],
    debug: { logErrors: true, logEmits: true },
    inlineStylesheet: true,
    inlineImages: false,
    collectFonts: true,
    maskInputOptions: { password: true, email: true, text: true },
    blockClass: 'rr-block',
    maskTextClass: 'rr-mask-text',
    ignoreClass: 'rr-ignore',
    slimDOMOptions: {
      script: true,
      comment: false,
      headFavicon: true,
      headWhitespace: true,
      headMetaDescKeywords: true,
      headMetaSocial: true,
      headMetaRobots: true,
      headMetaHttpEquiv: true,
      headMetaAuthorship: true,
      headMetaVerification: true,
    },
    maskInputFn: (text) => text,
    maskTextFn: (text) => text,
    errorHandler: (_err) => {},
    plugins: [{}],
  },
  reportLevel: 'warning',
  resource: { component: 'checkout' },
  retryInterval: 1000,
  rewriteFilenamePatterns: ['dist/(.*)'],
  scrubFields: ['password', 'creditcard'],
  scrubHeaders: ['authorization'],
  tracing: {
    enabled: true,
    endpoint: '/trace',
    transformSpan: ({ span }) => {
      void span;
    },
  },
};

rb.configure(cfg);

// Guardrails: ensure public API and config keys stay in sync with declarations.
type RollbarInstanceMembers =
  | 'global'
  | 'configure'
  | 'lastError'
  | 'log'
  | 'debug'
  | 'info'
  | 'warn'
  | 'warning'
  | 'error'
  | 'critical'
  | 'wait'
  | 'triggerDirectReplay'
  | 'captureEvent'
  | 'lambdaHandler'
  | 'errorHandler'
  | 'rollbar'
  | 'options';

type InstanceExtra = Exclude<keyof Rollbar, RollbarInstanceMembers>;
type InstanceMissing = Exclude<RollbarInstanceMembers, keyof Rollbar>;
type _assertInstanceExtra = InstanceExtra extends never ? true : InstanceExtra;
type _assertInstanceMissing = InstanceMissing extends never
  ? true
  : InstanceMissing;

type RollbarConfigKeys =
  | 'accessToken'
  | 'addErrorContext'
  | 'addRequestData'
  | 'autoInstrument'
  | 'captureDeviceInfo'
  | 'captureEmail'
  | 'captureIp'
  | 'captureLambdaTimeouts'
  | 'captureUncaught'
  | 'captureUnhandledRejections'
  | 'captureUsername'
  | 'checkIgnore'
  | 'codeVersion'
  | 'code_version'
  | 'enabled'
  | 'endpoint'
  | 'exitOnUncaughtException'
  | 'environment'
  | 'filterTelemetry'
  | 'host'
  | 'hostBlackList'
  | 'hostBlockList'
  | 'hostWhiteList'
  | 'hostSafeList'
  | 'ignoredMessages'
  | 'ignoreDuplicateErrors'
  | 'includeItemsInTelemetry'
  | 'inspectAnonymousErrors'
  | 'itemsPerMinute'
  | 'locals'
  | 'logLevel'
  | 'maxItems'
  | 'maxRetries'
  | 'maxTelemetryEvents'
  | 'nodeSourceMaps'
  | 'onSendCallback'
  | 'overwriteScrubFields'
  | 'payload'
  | 'replay'
  | 'reportLevel'
  | 'resource'
  | 'retryInterval'
  | 'rewriteFilenamePatterns'
  | 'scrubFields'
  | 'scrubHeaders'
  | 'telemetryScrubber'
  | 'tracing';

type ConfigExtra = Exclude<keyof Rollbar.Configuration, RollbarConfigKeys>;
type ConfigMissing = Exclude<RollbarConfigKeys, keyof Rollbar.Configuration>;
type _assertConfigExtra = ConfigExtra extends never ? true : ConfigExtra;
type _assertConfigMissing = ConfigMissing extends never ? true : ConfigMissing;
