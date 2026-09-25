// src/app/rollbar.errorhandler.ts
import { ErrorHandler, inject, Injectable } from '@angular/core';

import { RollbarService } from './rollbar.service';

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  private readonly rollbarService = inject(RollbarService);

  handleError(error: any): void {
    // Keep errors visible in the console, even before Rollbar has loaded.
    console.error(error);

    // Send the error to Rollbar once it has loaded.
    void this.rollbarService.load().then((rollbar) => rollbar?.error(error));
  }
}
