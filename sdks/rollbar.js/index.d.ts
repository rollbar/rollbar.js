// Type definitions for rollbar 2.1.1
// Project: Rollbar

/*~ This is the module template file for class modules.
 *~ You should rename it to index.d.ts and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

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
}

declare namespace Rollbar {
    export type MaybeError = Error | undefined | null;
    export type Level = "debug" | "info" | "warning" | "error" | "critical";
    export interface Configuration {
        accessToken: string;
        version?: string;
        scrubFields?: string[];
        logLevel?: Level;
        reportLevel?: Level;
        uncaughtErrorLevel?: Level;
        endpoint?: string;
        verbose?: boolean;
        enabled?: boolean;
        captureUncaught?: boolean;
        captureUnhandledRejections?: boolean;
        payload?: object;
    }
    export type Callback = (err: MaybeError, response: object) => void;
    export type LogArgument = string | Error | object | Callback | Date | any[];
    export interface LogResult {
        uuid: string;
    }
}
