// src/app/rollbar.errorhandler.ts
import { ErrorHandler, inject, Injectable, InjectionToken } from '@angular/core';
import * as Rollbar from 'rollbar';

// InjectionToken for providing a Rollbar instance
export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  // Option 1: Use `inject` (if you’re using Angular v14+)
  private rollbar = inject(RollbarService);

  handleError(error: any): void {
    // Send error to Rollbar
    this.rollbar.error(error);
    // Optionally rethrow the error if you want default logging
    throw error;
  }
}
