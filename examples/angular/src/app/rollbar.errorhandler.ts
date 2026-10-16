// src/app/rollbar.errorhandler.ts
import {
  ErrorHandler,
  inject,
  Injectable,
  REQUEST_CONTEXT,
} from '@angular/core';
import type Rollbar from 'rollbar';

import { RollbarService } from './rollbar.service';

/**
 * The request context that `server.ts` passes to
 * `AngularNodeAppEngine.handle()`.
 */
export interface RollbarRequestContext {
  /** Reports an error with the server's Rollbar instance. */
  reportError(error: Rollbar.LogArgument): void;
}

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  private readonly rollbarService = inject(RollbarService);
  // Only set during server-side rendering of a request.
  private readonly requestContext = inject(
    REQUEST_CONTEXT,
  ) as RollbarRequestContext | null;

  handleError(error: any): void {
    // Keep errors visible in the console, even before Rollbar has loaded.
    console.error(error);

    if (this.requestContext) {
      this.requestContext.reportError(error);
      return;
    }

    // Send the error to Rollbar once it has loaded.
    void this.rollbarService.load().then((rollbar) => rollbar?.error(error));
  }
}
