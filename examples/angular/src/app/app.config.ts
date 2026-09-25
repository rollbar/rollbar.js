// src/app/app.config.ts
import type { ApplicationConfig } from '@angular/core';
import { ErrorHandler } from '@angular/core';

import { RollbarErrorHandler } from './rollbar.errorhandler';

export const appConfig: ApplicationConfig = {
  providers: [
    // Override Angular’s default ErrorHandler
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
  ],
};
