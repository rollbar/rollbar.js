import Rollbar from '../src/browser/core.js';

declare global {
  interface Window {
    nise: typeof import('nise');

    console: Console;

    fetch: import('sinon').SinonStub;
    fetchStub: import('sinon').SinonStub;

    rollbar: Rollbar;
    Rollbar: Rollbar;

    server: import('nise').FakeServer;
    chrome: { runtime: boolean };
    jsonPayload: string;
    _rollbarURH: ((evt: PromiseRejectionEvent) => void) & {
      belongsToShim?: boolean;
    };
  }
}
