// src/app/app.component.ts
import { Component, inject } from '@angular/core';

import { RollbarService } from './rollbar.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>Rollbar Standalone App</h1>
    <button (click)="throwAnError()">Throw an Error</button>
    <button (click)="logWarning()">Log a Warning</button>
  `,
})
export class AppComponent {
  private readonly rollbarService = inject(RollbarService);

  throwAnError(): void {
    // This will be caught by our RollbarErrorHandler
    throw new Error('Test error from AppComponent!');
  }

  logWarning(): void {
    // Manually log a warning to Rollbar
    void this.rollbarService
      .load()
      .then((rollbar) => rollbar?.warning('Test warning from AppComponent'));
  }
}
