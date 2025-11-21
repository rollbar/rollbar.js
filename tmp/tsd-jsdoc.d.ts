declare type RollbarDictionary = {
    [key: string]: any;
};

declare type RollbarStringAttributes = {
    [key: string]: string;
};

declare type RollbarLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

declare type RollbarCallback = (err: Error | undefined | null, response: any) => void;

declare type RollbarMaybeError = Error | undefined | null;

declare type RollbarTelemetryScrubber = (description: RollbarTelemetryScrubberInput) => boolean;

declare type RollbarDomAttribute = {
    key: 'type' | 'name' | 'title' | 'alt';
    value: string;
};

declare type RollbarDomDescription = {
    tagName: string;
    id: string | undefined;
    classes: string[] | undefined;
    attributes: RollbarDomAttribute[];
};

declare type RollbarTelemetryScrubberInput = RollbarDomDescription | null;

declare type RollbarAutoInstrumentSettings = {
    network?: boolean;
    networkResponseHeaders?: boolean | string[];
    networkResponseBody?: boolean;
    networkRequestBody?: boolean;
    log?: boolean;
    dom?: boolean;
    navigation?: boolean;
    connectivity?: boolean;
    contentSecurityPolicy?: boolean;
    errorOnContentSecurityPolicy?: boolean;
};

declare type RollbarAutoInstrumentOptions = boolean | RollbarAutoInstrumentSettings;

declare type RollbarPerson = {
    id: string | number | null;
    username?: string;
    email?: string;
    property?: any;
};

declare type RollbarClientJavascript = {
    code_version?: string | number;
    source_map_enabled?: boolean;
    guess_uncaught_frames?: boolean;
    property?: any;
};

declare type RollbarClientPayload = {
    javascript?: RollbarClientJavascript;
    property?: any;
};

declare type RollbarServerPayload = {
    branch?: string;
    host?: string;
    root?: string;
    property?: any;
};

declare type RollbarPayload = {
    person?: RollbarPerson;
    context?: any;
    client?: RollbarClientPayload;
    environment?: string;
    server?: RollbarServerPayload;
    property?: any;
};

declare type RollbarReplayTriggerDefaults = {
    samplingRatio?: number;
    preDuration?: number;
    postDuration?: number;
};

declare type RollbarReplayTrigger = {
    type: string;
    samplingRatio?: number;
    preDuration?: number;
    postDuration?: number;
    predicateFn?: (...params: any[]) => any;
    level?: RollbarLevel[];
    pathMatch?: string | RegExp;
    tags?: string[];
};

declare type RollbarReplayDebug = {
    logErrors?: boolean;
    logEmits?: boolean;
};

declare type RollbarReplaySlimDOM = {
    script?: boolean;
    comment?: boolean;
    headFavicon?: boolean;
    headWhitespace?: boolean;
    headMetaDescKeywords?: boolean;
    headMetaSocial?: boolean;
    headMetaRobots?: boolean;
    headMetaHttpEquiv?: boolean;
    headMetaAuthorship?: boolean;
    headMetaVerification?: boolean;
};

declare type RollbarReplayOptions = {
    enabled?: boolean;
    autoStart?: boolean;
    triggerDefaults?: RollbarReplayTriggerDefaults;
    triggers?: RollbarReplayTrigger[];
    debug?: RollbarReplayDebug;
    inlineStylesheet?: boolean;
    inlineImages?: boolean;
    collectFonts?: boolean;
    maskInputOptions?: {
        [key: string]: boolean;
    };
    blockClass?: string;
    maskTextClass?: string;
    ignoreClass?: string;
    slimDOMOptions?: RollbarReplaySlimDOM;
    maskInputFn?: (...params: any[]) => any;
    maskTextFn?: (...params: any[]) => any;
    errorHandler?: (...params: any[]) => any;
    plugins?: any[];
};

declare type RollbarTransformSpanParams = {
    span: any;
};

declare type RollbarTracingOptions = {
    enabled?: boolean;
    endpoint?: string;
    transformSpan?: (...params: any[]) => any;
};

declare type RollbarLocalsSettings = {
    module: any;
    enabled?: boolean;
    uncaughtOnly?: boolean;
    depth?: number;
    maxProperties?: number;
    maxArray?: number;
};

declare type RollbarLocalsOptions = RollbarLocalsSettings | (() => void);

declare type RollbarConfiguration = {
    accessToken?: string;
    addErrorContext?: boolean;
    addRequestData?: (...params: any[]) => any;
    autoInstrument?: RollbarAutoInstrumentOptions;
    captureDeviceInfo?: boolean;
    captureEmail?: boolean;
    captureIp?: boolean | 'anonymize';
    captureLambdaTimeouts?: boolean;
    captureUncaught?: boolean;
    captureUnhandledRejections?: boolean;
    captureUsername?: boolean;
    checkIgnore?: (...params: any[]) => any;
    codeVersion?: string;
    code_version?: string;
    enabled?: boolean;
    endpoint?: string;
    exitOnUncaughtException?: boolean;
    environment?: string;
    filterTelemetry?: (...params: any[]) => any;
    host?: string;
    hostBlackList?: string[];
    hostBlockList?: string[];
    hostWhiteList?: string[];
    hostSafeList?: string[];
    ignoredMessages?: (string | RegExp)[];
    ignoreDuplicateErrors?: boolean;
    includeItemsInTelemetry?: boolean;
    inspectAnonymousErrors?: boolean;
    itemsPerMinute?: number;
    locals?: RollbarLocalsOptions;
    logLevel?: RollbarLevel;
    maxItems?: number;
    maxRetries?: number;
    maxTelemetryEvents?: number;
    nodeSourceMaps?: boolean;
    onSendCallback?: (...params: any[]) => any;
    overwriteScrubFields?: boolean;
    payload?: RollbarPayload;
    replay?: RollbarReplayOptions;
    reportLevel?: RollbarLevel;
    resource?: RollbarStringAttributes;
    retryInterval?: number | null;
    rewriteFilenamePatterns?: string[];
    scrubFields?: string[];
    scrubHeaders?: string[];
    scrubPaths?: string[];
    scrubRequestBody?: boolean;
    scrubTelemetryInputs?: boolean;
    sendConfig?: boolean;
    stackTraceLimit?: number;
    telemetryScrubber?: RollbarTelemetryScrubber;
    timeout?: number;
    tracing?: RollbarTracingOptions;
    transform?: (...params: any[]) => any;
    transmit?: boolean;
    uncaughtErrorLevel?: RollbarLevel;
    verbose?: boolean;
    version?: string;
    wrapGlobalEventHandlers?: boolean;
};

declare type RollbarLogResult = {
    uuid: string;
};

declare type RollbarTelemetryEvent = {
    level: RollbarLevel;
    type: string;
    timestamp_ms: number;
    body: RollbarDictionary;
    source: string;
    uuid?: string;
};

declare type RollbarComponents = {
    telemeter?: (...params: any[]) => any;
    instrumenter?: (...params: any[]) => any;
    wrapGlobals?: (...params: any[]) => any;
    scrub?: (...params: any[]) => any;
    truncation?: (...params: any[]) => any;
    tracing?: (...params: any[]) => any;
    replay?: (...params: any[]) => any;
};

declare class Rollbar {
    static init(options: RollbarConfiguration): void;
    static setComponents(components: RollbarComponents): void;
    global(options: RollbarConfiguration): void;
    configure(options: RollbarConfiguration): void;
    lastError(): RollbarMaybeError;
    log(): RollbarLogResult;
    debug(): RollbarLogResult;
    info(): RollbarLogResult;
    warn(): RollbarLogResult;
    warning(): RollbarLogResult;
    error(): RollbarLogResult;
    critical(): RollbarLogResult;
    wait(callback: (...params: any[]) => any): void;
    triggerDirectReplay(context: RollbarDictionary): void;
    /**
     * @param metadata - @param {RollbarLevel} level
     */
    captureEvent(metadata: any): void;
    lambdaHandler(handler: (...params: any[]) => any): void;
    errorHandler(): (...params: any[]) => any;
    rollbar: Rollbar;
    options: RollbarConfiguration;
}

declare class Rollbar {
    static init(options: RollbarConfiguration): void;
    static setComponents(components: RollbarComponents): void;
    global(options: RollbarConfiguration): void;
    configure(options: RollbarConfiguration): void;
    lastError(): RollbarMaybeError;
    log(): RollbarLogResult;
    debug(): RollbarLogResult;
    info(): RollbarLogResult;
    warn(): RollbarLogResult;
    warning(): RollbarLogResult;
    error(): RollbarLogResult;
    critical(): RollbarLogResult;
    wait(callback: (...params: any[]) => any): void;
    triggerDirectReplay(context: RollbarDictionary): void;
    /**
     * @param metadata - @param {RollbarLevel} level
     */
    captureEvent(metadata: any): void;
    lambdaHandler(handler: (...params: any[]) => any): void;
    errorHandler(): (...params: any[]) => any;
    rollbar: Rollbar;
    options: RollbarConfiguration;
}

