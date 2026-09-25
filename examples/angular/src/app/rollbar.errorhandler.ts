// src/app/rollbar.errorhandler.ts
import { type ErrorHandler, inject, Injectable, NgZone } from '@angular/core';
import { defer, map, shareReplay } from 'rxjs';

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  private ngZone = inject(NgZone);

  // Lazily load Rollbar on first error to keep it out of the initial bundle.
  // `defer` ensures the dynamic import is not triggered until the first
  // subscription. `shareReplay` caches the result so subsequent errors reuse
  // the same Rollbar instance without re-importing or re-initializing.
  private rollbar$ = defer(() => import('./rollbar.config')).pipe(
    map(({ createRollbar }) => createRollbar()),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  handleError(error: any): void {
    // Run outside Angular's zone so that the dynamic import and Rollbar's
    // internal async work do not trigger unnecessary change detection cycles.
    this.ngZone.runOutsideAngular(() => {
      this.rollbar$.subscribe(rollbar => {
        // Send error to Rollbar
        rollbar.error(error);
        // Rollbar load failures are intentionally ignored — error reporting
        // is best-effort and should never affect the application's behaviour.
      });
    });
    // Log to the console so errors remain visible during development even
    // if Rollbar has not finished loading yet.
    console.error(error);
  }
}
