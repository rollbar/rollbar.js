// src/app/app.config.ts
import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { RollbarErrorHandler } from './rollbar.errorhandler';
import { RollbarService } from './rollbar.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // Forward uncaught errors and unhandled promise rejections to the
    // ErrorHandler, so they are reported by RollbarErrorHandler as well.
    provideBrowserGlobalErrorListeners(),

    // Override Angular’s default ErrorHandler
    { provide: ErrorHandler, useClass: RollbarErrorHandler },

    // Start loading Rollbar as soon as the app starts, without waiting for it,
    // so telemetry is collected before the first error occurs.
    provideAppInitializer(() => {
      void inject(RollbarService).load();
    }),

    provideRouter(routes),
    provideClientHydration(),
  ],
};
