export default Rollbar;
declare class Rollbar {
    constructor(options?: Rollbar.Configuration);
    static init(options: Rollbar.Configuration): Rollbar;
    static setComponents(components: Rollbar.Components): void;
    global(options: Rollbar.Configuration): Rollbar;
    configure(options: Rollbar.Configuration): Rollbar;
    lastError(): Rollbar.MaybeError;
    log(...args: Rollbar.LogArgument[]): Rollbar.LogResult;
    debug(...args: Rollbar.LogArgument[]): Rollbar.LogResult;
    info(...args: Rollbar.LogArgument[]): Rollbar.LogResult;
    warn(...args: Rollbar.LogArgument[]): Rollbar.LogResult;
    warning(...args: Rollbar.LogArgument[]): Rollbar.LogResult;
    error(...args: Rollbar.LogArgument[]): Rollbar.LogResult;
    critical(...args: Rollbar.LogArgument[]): Rollbar.LogResult;
    wait(callback: () => void): void;
    triggerDirectReplay(context: Rollbar.Dictionary): Rollbar.Dictionary | null;
    captureEvent(metadata: object, level: Rollbar.Level): Rollbar.TelemetryEvent;
    lambdaHandler<T = object>(handler: Rollbar.LambdaHandler<T>): Rollbar.LambdaHandler<T>;
    errorHandler(): Rollbar.ExpressErrorHandler;
    rollbar: Rollbar;
    options: Rollbar.Configuration;
}
declare namespace Rollbar {
    type LambdaHandler<TEvent = any, TResult = any, TContext = any> = (event: TEvent, context: TContext, callback: Callback<TResult>) => void | Promise<TResult>;
    type MaybeError = Error | undefined | null;
    type Level = 'debug' | 'info' | 'warning' | 'error' | 'critical';
    type Dictionary = Record<string, unknown>;
    type StringAttributes = Record<string, string>;
    /**
     * {@link https://docs.rollbar.com/docs/rollbarjs-configuration-reference#reference}
     */
    interface Configuration {
        accessToken?: string;
        addErrorContext?: boolean;
        addRequestData?: (data: Dictionary, req: Dictionary) => void;
        autoInstrument?: AutoInstrumentOptions;
        captureDeviceInfo?: boolean;
        captureEmail?: boolean;
        captureIp?: boolean | 'anonymize';
        captureLambdaTimeouts?: boolean;
        captureUncaught?: boolean;
        captureUnhandledRejections?: boolean;
        captureUsername?: boolean;
        checkIgnore?: (isUncaught: boolean, args: LogArgument[], item: Dictionary) => boolean;
        /**
         * `codeVersion` takes precedence over `code_version`, if provided.
         * `client.javascript.code_version` takes precedence over both top level properties.
         */
        codeVersion?: string;
        /**
         * `codeVersion` takes precedence over `code_version`, if provided.
         * `client.javascript.code_version` takes precedence over both top level properties.
         */
        code_version?: string;
        enabled?: boolean;
        endpoint?: string;
        exitOnUncaughtException?: boolean;
        environment?: string;
        filterTelemetry?: (e: TelemetryEvent) => boolean;
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
        locals?: LocalsOptions;
        logLevel?: Level;
        maxItems?: number;
        maxRetries?: number;
        maxTelemetryEvents?: number;
        nodeSourceMaps?: boolean;
        onSendCallback?: (isUncaught: boolean, args: LogArgument[], item: Dictionary) => void;
        overwriteScrubFields?: boolean;
        payload?: Payload;
        replay?: ReplayOptions;
        reportLevel?: Level;
        resource?: StringAttributes;
        retryInterval?: number | null;
        rewriteFilenamePatterns?: string[];
        scrubFields?: string[];
        scrubHeaders?: string[];
        scrubPaths?: string[];
        scrubRequestBody?: boolean;
        scrubTelemetryInputs?: boolean;
        sendConfig?: boolean;
        stackTraceLimit?: number;
        telemetryScrubber?: TelemetryScrubber;
        timeout?: number;
        tracing?: TracingOptions;
        transform?: (data: Dictionary, item: Dictionary) => void | Promise<void>;
        transmit?: boolean;
        uncaughtErrorLevel?: Level;
        verbose?: boolean;
        version?: string;
        wrapGlobalEventHandlers?: boolean;
    }
    type Callback<TResponse = any> = (err: MaybeError, response: TResponse) => void;
    type LogArgument = string | Error | object | Dictionary | Callback | Date | any[] | undefined;
    interface LogResult {
        uuid: string;
    }
    interface TelemetryEvent {
        level: Level;
        type: string;
        timestamp_ms: number;
        body: Dictionary;
        source: string;
        uuid?: string;
    }
    type AutoInstrumentOptions = boolean | AutoInstrumentSettings;
    interface AutoInstrumentSettings {
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
    }
    type TelemetryScrubber = (description: TelemetryScrubberInput) => boolean;
    type TelemetryScrubberInput = DomDescription | null;
    interface DomDescription {
        tagName: string;
        id: string | undefined;
        classes: string[] | undefined;
        attributes: DomAttribute[];
    }
    type DomAttributeKey = 'type' | 'name' | 'title' | 'alt';
    interface DomAttribute {
        key: DomAttributeKey;
        value: string;
    }
    type ExpressErrorHandler = (err: any, request: any, response: any, next: ExpressNextFunction) => any;
    type ExpressNextFunction = (err?: any) => void;
    class Locals {
    }
    type LocalsType = typeof Locals;
    type LocalsOptions = LocalsType | LocalsSettings;
    interface LocalsSettings {
        module: LocalsType;
        enabled?: boolean;
        uncaughtOnly?: boolean;
        depth?: number;
        maxProperties?: number;
        maxArray?: number;
    }
    class Telemeter {
    }
    class Instrumenter {
    }
    class Tracing {
    }
    class Replay {
    }
    type TelemeterType = typeof Telemeter;
    type InstrumenterType = typeof Instrumenter;
    type TracingType = typeof Tracing;
    type ReplayType = typeof Replay;
    type TruncationType = object;
    type ScrubType = (data: object, scrubFields?: string[], scrubPaths?: string[]) => object;
    type WrapGlobalsType = (window?: any, handler?: any, shim?: any) => void;
    interface Components {
        telemeter?: TelemeterType;
        instrumenter?: InstrumenterType;
        wrapGlobals?: WrapGlobalsType;
        scrub?: ScrubType;
        truncation?: TruncationType;
        tracing?: TracingType;
        /**
         * Replay component for session recording.
         * Only available when using replay bundles (rollbar.replay.*).
         * Use `import Rollbar from 'rollbar/replay'` to access.
         */
        replay?: ReplayType;
    }
    interface ReplayOptions {
        enabled?: boolean;
        autoStart?: boolean;
        triggerDefaults?: {
            samplingRatio?: number;
            preDuration?: number;
            postDuration?: number;
        };
        triggers?: {
            type: string;
            samplingRatio?: number;
            preDuration?: number;
            postDuration?: number;
            predicateFn?: (trigger: Dictionary, context: Dictionary) => boolean;
            level?: Level[];
            pathMatch?: string | RegExp;
            tags?: string[];
        }[];
        debug?: {
            logErrors?: boolean;
            logEmits?: boolean;
        };
        inlineStylesheet?: boolean;
        inlineImages?: boolean;
        collectFonts?: boolean;
        maskInputOptions?: {
            password?: boolean;
            email?: boolean;
            tel?: boolean;
            text?: boolean;
            color?: boolean;
            date?: boolean;
            'datetime-local'?: boolean;
            month?: boolean;
            number?: boolean;
            range?: boolean;
            search?: boolean;
            time?: boolean;
            url?: boolean;
            week?: boolean;
        };
        blockClass?: string;
        maskTextClass?: string;
        ignoreClass?: string;
        slimDOMOptions?: {
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
        maskInputFn?: (text: string) => string;
        maskTextFn?: (text: string) => string;
        errorHandler?: (error: Error) => void;
        plugins?: any[];
    }
    interface TransformSpanParams {
        span: any;
    }
    interface TracingOptions {
        enabled?: boolean;
        endpoint?: string;
        transformSpan?: (params: TransformSpanParams) => void;
    }
    /**
     * @deprecated number is deprecated for this field
     */
    type DeprecatedNumber = number;
    /**
     * {@link https://docs.rollbar.com/docs/rollbarjs-configuration-reference#payload-1}
     */
    interface Payload {
        person?: {
            id: string | DeprecatedNumber | null;
            username?: string;
            email?: string;
            [property: string]: any;
        };
        context?: any;
        client?: {
            javascript?: {
                /**
                 * Version control number (i.e. git SHA) of the current revision. Used for linking filenames in stacktraces to GitHub.
                 * Note: for the purposes of nesting under the payload key, only code_version will correctly set the value in the final item.
                 * However, if you wish to set this code version at the top level of the configuration object rather than nested under
                 * the payload key, we will accept both codeVersion and code_version with codeVersion given preference if both happened
                 * to be defined. Furthermore, if code_version is nested under the payload key this will have the final preference over
                 * any value set at the top level.
                 */
                code_version?: string | DeprecatedNumber;
                /**
                 * When true, the Rollbar service will attempt to find and apply source maps to all frames in the stack trace.
                 * @default false
                 */
                source_map_enabled?: boolean;
                /**
                 * When true, the Rollbar service will attempt to apply source maps to frames even if they are missing column numbers.
                 * Works best when the minified javascript file is generated using newlines instead of semicolons.
                 * @default false
                 */
                guess_uncaught_frames?: boolean;
                [property: string]: any;
            };
            [property: string]: any;
        };
        /**
         * The environment that your code is running in.
         * @default undefined
         */
        environment?: string;
        server?: {
            /**
             * @default master
             */
            branch?: string;
            /**
             * The hostname of the machine that rendered the page.
             */
            host?: string;
            /**
             * It is used in two different ways: `source maps`, and `source control`.
             *
             * If you are looking for more information on it please go to:
             * {@link https://docs.rollbar.com/docs/source-maps}
             * {@link https://docs.rollbar.com/docs/source-control}
             */
            root?: string;
            [property: string]: any;
        };
        [property: string]: any;
    }
}
