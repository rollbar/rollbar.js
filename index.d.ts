// Type definitions for rollbar
// Project: Rollbar

export = Rollbar;

declare class Rollbar {
    constructor(options?: Rollbar.Configuration);
    static init(options: Rollbar.Configuration): Rollbar;
    static setComponents(components: Rollbar.Components): void;

    public global(options: Rollbar.Configuration): Rollbar;
    public configure(options: Rollbar.Configuration): Rollbar;
    public lastError(): Rollbar.MaybeError;

    public log(...args: Rollbar.LogArgument[]): Rollbar.LogResult;
    public debug(...args: Rollbar.LogArgument[]): Rollbar.LogResult;
    public info(...args: Rollbar.LogArgument[]): Rollbar.LogResult;
    public warn(...args: Rollbar.LogArgument[]): Rollbar.LogResult;
    public warning(...args: Rollbar.LogArgument[]): Rollbar.LogResult;
    public error(...args: Rollbar.LogArgument[]): Rollbar.LogResult;
    public critical(...args: Rollbar.LogArgument[]): Rollbar.LogResult;
    public wait(callback: () => void): void;

    public captureEvent(metadata: object, level: Rollbar.Level): Rollbar.TelemetryEvent;

    public lambdaHandler<T = object>(handler: Rollbar.LambdaHandler<T>): Rollbar.LambdaHandler<T>;

    public errorHandler(): Rollbar.ExpressErrorHandler;

    // Used with rollbar-react for rollbar-react-native compatibility.
    public rollbar: Rollbar;

    // Exposed only for testing, should be changed via the configure method
    // DO NOT MODIFY DIRECTLY
    public options: Rollbar.Configuration;
}

declare namespace Rollbar {
    export type LambdaHandler<TEvent = any, TResult = any, TContext = any> = (
        event: TEvent,
        context: TContext,
        callback: Callback<TResult>,
    ) => void | Promise<TResult>;
    export type MaybeError = Error | undefined | null;
    export type Level = "debug" | "info" | "warning" | "error" | "critical";
    export type Dictionary = { [key: string]: unknown};
    /**
     * {@link https://docs.rollbar.com/docs/rollbarjs-configuration-reference#reference}
     */
    export interface Configuration {
        accessToken?: string;
        addErrorContext?: boolean;
        addRequestData?: (data: Dictionary, req: Dictionary) => void;
        autoInstrument?: AutoInstrumentOptions;
        captureDeviceInfo?: boolean;
        captureEmail?: boolean;
        captureIp?: boolean | "anonymize";
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
        host?: string; // used in node only
        hostBlackList?: string[]; // deprecated
        hostBlockList?: string[];
        hostWhiteList?: string[]; // deprecated
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
        reportLevel?: Level;
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
        transform?: (data: Dictionary, item: Dictionary) => void | Promise<void>;
        transmit?: boolean;
        uncaughtErrorLevel?: Level;
        verbose?: boolean;
        version?: string;
        wrapGlobalEventHandlers?: boolean;
    }
    export type Callback<TResponse = any> = (err: MaybeError, response: TResponse) => void;
    export type LogArgument = string | Error | object | Dictionary | Callback | Date | any[] | undefined;
    export interface LogResult {
        uuid: string;
    }
    export interface TelemetryEvent {
        level: Level;
        type: string;
        timestamp_ms: number;
        body: Dictionary;
        source: string;
        uuid?: string;
    }
    export type AutoInstrumentOptions = boolean | AutoInstrumentSettings;
    export interface AutoInstrumentSettings {
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
    export type TelemetryScrubber = (description: TelemetryScrubberInput) => boolean;
    export type TelemetryScrubberInput = DomDescription | null;
    export interface DomDescription {
        tagName: string;
        id: string | undefined;
        classes: string[] | undefined;
        attributes: DomAttribute[];
    }
    export type DomAttributeKey = "type" | "name" | "title" | "alt";
    export interface DomAttribute {
        key: DomAttributeKey;
        value: string;
    }
    export type ExpressErrorHandler = (err: any, request: any, response: any, next: ExpressNextFunction) => any;
    export interface ExpressNextFunction {
      (err?: any): void;
    }
    class Locals {}
    export type LocalsType = typeof Locals;
    export type LocalsOptions = LocalsType | LocalsSettings;
    export interface LocalsSettings {
        module: LocalsType,
        enabled?: boolean;
        uncaughtOnly?: boolean;
        depth?: number;
        maxProperties?: number;
        maxArray?: number;
    }

    class Telemeter {}
    class Instrumenter {}

    export type TelemeterType = typeof Telemeter;
    export type InstrumenterType = typeof Instrumenter;
    export type TruncationType = object;
    export type ScrubType = (data: object, scrubFields?: string[], scrubPaths?: string[]) => object;
    export type WrapGlobalsType = (window?: any, handler?: any, shim?: any) => void;
    export type PolyfillJSONType = (JSON: any) => any;

    export interface Components {
        telemeter?: TelemeterType,
        instrumenter?: InstrumenterType,
        polyfillJSON?: PolyfillJSONType,
        wrapGlobals?: WrapGlobalsType,
        scrub?: ScrubType,
        truncation?: TruncationType
    }

    /**
      * @deprecated number is deprecated for this field
      */
     export type DeprecatedNumber = number;

    /**
     * {@link https://docs.rollbar.com/docs/rollbarjs-configuration-reference#payload-1}
     */
    export interface Payload {
        person?: {
            id: string | DeprecatedNumber | null;
            username?: string;
            email?: string;
            [property: string]: any;
        },
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
            }
            [property: string]: any;
        },
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
        },
        [property: string]: any;
    }
}
