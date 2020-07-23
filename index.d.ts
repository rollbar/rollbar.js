// Type definitions for rollbar
// Project: Rollbar

export = Rollbar;

declare class Rollbar {
    constructor(options?: Rollbar.Configuration);
    static init(options: Rollbar.Configuration): Rollbar;

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
    export interface Configuration {
        accessToken?: string;
        addErrorContext?: boolean;
        addRequestData?: (data: object, req: object) => void;
        autoInstrument?: AutoInstrumentOptions;
        captureEmail?: boolean;
        captureIp?: boolean | "anonymize";
        captureLambdaTimeouts?: boolean;
        captureUncaught?: boolean;
        captureUnhandledRejections?: boolean;
        captureUsername?: boolean;
        checkIgnore?: (isUncaught: boolean, args: LogArgument[], item: object) => boolean;
        codeVersion?: string;
        code_version?: string;
        enabled?: boolean;
        endpoint?: string;
        exitOnUncaughtException?: boolean;
        environment?: string;
        filterTelemetry?: (e: TelemetryEvent) => boolean;
        host?: string; // used in node only
        hostBlackList?: string[];
        hostWhiteList?: string[];
        ignoredMessages?: string[];
        ignoreDuplicateErrors?: boolean;
        includeItemsInTelemetry?: boolean;
        inspectAnonymousErrors?: boolean;
        itemsPerMinute?: number;
        logLevel?: Level;
        maxItems?: number;
        maxTelemetryEvents?: number;
        nodeSourceMaps?: boolean;
        onSendCallback?: (isUncaught: boolean, args: LogArgument[], item: object) => void;
        overwriteScrubFields?: boolean;
        payload?: object;
        reportLevel?: Level;
        rewriteFilenamePatterns?: string[];
        scrubFields?: string[];
        scrubHeaders?: string[];
        scrubRequestBody?: boolean;
        scrubTelemetryInputs?: boolean;
        sendConfig?: boolean;
        stackTraceLimit?: number;
        telemetryScrubber?: TelemetryScrubber;
        transform?: (data: object) => void;
        transmit?: boolean;
        uncaughtErrorLevel?: Level;
        verbose?: boolean;
        version?: string;
        wrapGlobalEventHandlers?: boolean;
    }
    export type Callback<TResponse = any> = (err: MaybeError, response: TResponse) => void;
    export type LogArgument = string | Error | object | Callback | Date | any[];
    export interface LogResult {
        uuid: string;
    }
    export interface TelemetryEvent {
        level: Level;
        type: string;
        timestamp_ms: number;
        body: object;
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
}
