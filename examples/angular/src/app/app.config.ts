// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler } from '@angular/core';

import { RollbarService, RollbarErrorHandler } from './rollbar.errorhandler';
import { RollbarFactory } from './rollbar.config';

export const appConfig: ApplicationConfig = {
  providers: [
    // The usual providers for a browser app
    importProvidersFrom(BrowserModule),

    // Provide the Rollbar injection token with the Rollbar factory
    { provide: RollbarService, useFactory: RollbarFactory },

    // Override Angular’s default ErrorHandler
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
  ],
};
