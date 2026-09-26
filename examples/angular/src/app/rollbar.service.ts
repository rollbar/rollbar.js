// src/app/rollbar.service.ts
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import type Rollbar from 'rollbar';

/**
 * Loads Rollbar on demand so it stays out of the initial bundle.
 *
 * `load()` imports `./rollbar.config` and creates the Rollbar instance the
 * first time it is called, and returns the same instance after that. It
 * resolves to `null` if the chunk fails to load, so reporting never breaks the
 * app, and during server-side rendering, where `RollbarErrorHandler` reports
 * errors with the server's Rollbar instance from `server.ts` instead.
 */
@Injectable({ providedIn: 'root' })
export class RollbarService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private rollbar?: Promise<Rollbar | null>;

  load(): Promise<Rollbar | null> {
    if (!this.isBrowser) {
      return Promise.resolve(null);
    }

    this.rollbar ??= import('./rollbar.config')
      .then(({ createRollbar }) => createRollbar())
      .catch((err) => {
        console.error('Failed to load Rollbar', err);
        // Allow the next call to retry, eg. after a network blip.
        this.rollbar = undefined;
        return null;
      });

    return this.rollbar;
  }
}
